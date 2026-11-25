// Fechas y rangos para el selector de rango: lógica pura, sin React ni DOM.
// Las fechas viajan como texto ISO local "AAAA-MM-DD" (sin hora ni zona), así se pueden guardar,
// comparar como texto y pasar en el filtro de una tabla sin que una zona horaria corra el día.

/** Fecha como texto "AAAA-MM-DD" (calendario local). */
export type IsoDate = string;

/** Rango de fechas; un extremo `null` deja ese lado abierto ("desde" sin "hasta"). */
export interface DateRange {
  from: IsoDate | null;
  to: IsoDate | null;
}

const ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const RANGE_PATTERN = /^(\d{4}-\d{2}-\d{2})?\.\.(\d{4}-\d{2}-\d{2})?$/;
const DAYS_IN_WEEK = 7;
const WEEKS_IN_GRID = 6;

const pad = (value: number): string => String(value).padStart(2, "0");

/** "AAAA-MM-DD" de un `Date`, en el calendario local. */
export const toIsoDate = (date: Date): IsoDate =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** `Date` (a las 00:00 locales) de un texto ISO, o `null` si no es una fecha real ("2026-02-31"). */
export const parseIsoDate = (iso: string): Date | null => {
  const match = ISO_PATTERN.exec(iso);
  if (!match) {
    return null;
  }
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return toIsoDate(date) === iso ? date : null;
};

/** Pone los extremos en orden: si "desde" es posterior a "hasta", los invierte. */
export const normalizeRange = (range: DateRange): DateRange =>
  range.from && range.to && range.from > range.to
    ? { from: range.to, to: range.from }
    : range;

/** ¿La fecha cae dentro del rango (extremos incluidos)? Un lado abierto no limita. */
export const isInRange = (iso: IsoDate, range: DateRange): boolean =>
  (range.from === null || iso >= range.from) &&
  (range.to === null || iso <= range.to);

/** El rango como texto "AAAA-MM-DD..AAAA-MM-DD" ("..AAAA-MM-DD" o "AAAA-MM-DD.." si un lado está abierto). */
export const serializeDateRange = (range: DateRange): string =>
  range.from === null && range.to === null
    ? ""
    : `${range.from ?? ""}..${range.to ?? ""}`;

/** Lee el texto de `serializeDateRange`; `null` si no tiene esa forma o una fecha no existe. */
export const parseDateRange = (text: string): DateRange | null => {
  const match = RANGE_PATTERN.exec(text.trim());
  if (!match || (!match[1] && !match[2])) {
    return null;
  }
  const [, start, end] = match;
  if ((start && !parseIsoDate(start)) || (end && !parseIsoDate(end))) {
    return null;
  }
  return normalizeRange({ from: start ?? null, to: end ?? null });
};

/**
 * Las semanas de un mes para dibujarlo: siempre 6 filas de 7 días, con los días del mes anterior
 * y del siguiente que completan la grilla. `weekStart` es el día con que empieza la semana
 * (0 = domingo, 1 = lunes).
 */
export const buildMonthGrid = (
  year: number,
  month: number,
  weekStart = 1,
): Date[][] => {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() - weekStart + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const weeks: Date[][] = [];
  for (let week = 0; week < WEEKS_IN_GRID; week++) {
    weeks.push(
      Array.from(
        { length: DAYS_IN_WEEK },
        (_, day) =>
          new Date(year, month, 1 - offset + week * DAYS_IN_WEEK + day),
      ),
    );
  }
  return weeks;
};

/** Mueve una fecha esa cantidad de días (negativa para ir hacia atrás). */
export const addDays = (date: Date, days: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

/**
 * Mueve una fecha esa cantidad de meses sin pasarse de mes: el 31 de enero más un mes es el
 * último día de febrero, no el 3 de marzo.
 */
export const addMonths = (date: Date, months: number): Date => {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate();
  return new Date(
    target.getFullYear(),
    target.getMonth(),
    Math.min(date.getDate(), lastDay),
  );
};

/** A qué fecha lleva una tecla del calendario; `null` si la tecla no mueve el foco. */
export const keyboardTarget = (
  key: string,
  date: Date,
  weekStart = 1,
): Date | null => {
  const dayOfWeek = (date.getDay() - weekStart + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const steps: Record<string, () => Date> = {
    ArrowLeft: () => addDays(date, -1),
    ArrowRight: () => addDays(date, 1),
    ArrowUp: () => addDays(date, -DAYS_IN_WEEK),
    ArrowDown: () => addDays(date, DAYS_IN_WEEK),
    PageUp: () => addMonths(date, -1),
    PageDown: () => addMonths(date, 1),
    Home: () => addDays(date, -dayOfWeek),
    End: () => addDays(date, DAYS_IN_WEEK - 1 - dayOfWeek),
  };
  return steps[key]?.() ?? null;
};

/** Atajos habituales para elegir un período de un clic, calculados a partir de "hoy". */
export const presetRanges = (
  today: Date,
): Record<
  "today" | "last7Days" | "thisMonth" | "previousMonth",
  DateRange
> => ({
  today: { from: toIsoDate(today), to: toIsoDate(today) },
  last7Days: { from: toIsoDate(addDays(today, -6)), to: toIsoDate(today) },
  thisMonth: {
    from: toIsoDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    to: toIsoDate(new Date(today.getFullYear(), today.getMonth() + 1, 0)),
  },
  previousMonth: {
    from: toIsoDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
    to: toIsoDate(new Date(today.getFullYear(), today.getMonth(), 0)),
  },
});
