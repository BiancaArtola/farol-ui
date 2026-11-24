import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { cx } from "../../utils/classNames";
import {
  addDays,
  addMonths,
  buildMonthGrid,
  isInRange,
  normalizeRange,
  parseIsoDate,
  presetRanges,
  toIsoDate,
  type DateRange,
} from "./dateRange";
import styles from "./DateRangePicker.module.css";

export interface DateRangePickerLabels {
  /** Botón para ir al mes anterior. */
  previousMonth: string;
  /** Botón para ir al mes siguiente. */
  nextMonth: string;
  /** Botón que borra el rango. */
  clear: string;
  /** Atajos de período. */
  presets: {
    today: string;
    last7Days: string;
    thisMonth: string;
    previousMonth: string;
  };
}

const DEFAULT_LABELS: DateRangePickerLabels = {
  previousMonth: "Mes anterior",
  nextMonth: "Mes siguiente",
  clear: "Borrar fechas",
  presets: {
    today: "Hoy",
    last7Days: "Últimos 7 días",
    thisMonth: "Este mes",
    previousMonth: "Mes pasado",
  },
};

export interface DateRangePickerProps {
  /** Nombre accesible del calendario. */
  label: string;
  /** Rango elegido (las fechas como "AAAA-MM-DD"). Un solo extremo deja el otro lado abierto. */
  value: DateRange;
  onChange: (range: DateRange) => void;
  /** Idioma de los meses y días (por defecto español de Argentina). */
  locale?: string;
  /** Primer día de la semana: 0 = domingo, 1 = lunes (por defecto). */
  weekStart?: number;
  /** Muestra los atajos "Hoy", "Este mes"… (por defecto sí). */
  presets?: boolean;
  /** Textos de los botones; lo que no se pase queda en español. */
  labels?: Partial<Omit<DateRangePickerLabels, "presets">> & {
    presets?: Partial<DateRangePickerLabels["presets"]>;
  };
  /** Para fijar "hoy" (por ejemplo en pruebas); por defecto la fecha actual. */
  today?: Date;
  className?: string;
}

const startOfMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1);

/**
 * Calendario para elegir un rango de fechas: el primer clic fija el "desde" y el segundo el
 * "hasta" (si queda al revés se invierten). Con las flechas se recorre día a día, con Re Pág y
 * Av Pág se cambia de mes y con Enter o Espacio se elige. Es un calendario suelto, sin ventana:
 * para usarlo como desplegable, ponerlo dentro de un `Popover`.
 */
export const DateRangePicker = ({
  label,
  value,
  onChange,
  locale = "es-AR",
  weekStart = 1,
  presets = true,
  labels,
  today = new Date(),
  className,
}: DateRangePickerProps) => {
  const text = {
    ...DEFAULT_LABELS,
    ...labels,
    presets: { ...DEFAULT_LABELS.presets, ...labels?.presets },
  };
  const anchor = (value.from && parseIsoDate(value.from)) || today;
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(anchor));
  const [focused, setFocused] = useState(() => anchor);
  const gridRef = useRef<HTMLTableElement>(null);
  const shouldFocusRef = useRef(false);
  const todayIso = toIsoDate(today);
  // Con un "desde" y sin "hasta" el próximo clic completa el rango; si no, empieza uno nuevo.
  const isPickingEnd = value.from !== null && value.to === null;

  const monthTitle = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
      }).format(viewMonth),
    [locale, viewMonth],
  );
  const weekdays = useMemo(() => {
    const short = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const long = new Intl.DateTimeFormat(locale, { weekday: "long" });
    // 2026-11-01 es domingo: de ahí salen los siete días en orden.
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(2026, 10, 1 + ((weekStart + index) % 7));
      return { short: short.format(date), long: long.format(date) };
    });
  }, [locale, weekStart]);
  const dayLabel = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "full" }),
    [locale],
  );
  const weeks = useMemo(
    () =>
      buildMonthGrid(viewMonth.getFullYear(), viewMonth.getMonth(), weekStart),
    [viewMonth, weekStart],
  );

  // Tras moverse con el teclado el foco sigue a la fecha, también si cambió el mes que se ve.
  useEffect(() => {
    if (!shouldFocusRef.current) {
      return;
    }
    shouldFocusRef.current = false;
    gridRef.current
      ?.querySelector<HTMLElement>(`[data-iso="${toIsoDate(focused)}"]`)
      ?.focus();
  }, [focused, viewMonth]);

  const moveFocus = (next: Date) => {
    shouldFocusRef.current = true;
    setFocused(next);
    if (
      next.getMonth() !== viewMonth.getMonth() ||
      next.getFullYear() !== viewMonth.getFullYear()
    ) {
      setViewMonth(startOfMonth(next));
    }
  };

  const goToMonth = (months: number) => {
    const next = addMonths(viewMonth, months);
    setViewMonth(startOfMonth(next));
    setFocused(addMonths(focused, months));
  };

  const pick = (date: Date) => {
    const iso = toIsoDate(date);
    setFocused(date);
    onChange(
      isPickingEnd
        ? normalizeRange({ from: value.from, to: iso })
        : { from: iso, to: null },
    );
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    date: Date,
  ) => {
    const steps: Record<string, () => Date> = {
      ArrowLeft: () => addDays(date, -1),
      ArrowRight: () => addDays(date, 1),
      ArrowUp: () => addDays(date, -7),
      ArrowDown: () => addDays(date, 7),
      PageUp: () => addMonths(date, -1),
      PageDown: () => addMonths(date, 1),
      Home: () => addDays(date, -((date.getDay() - weekStart + 7) % 7)),
      End: () => addDays(date, 6 - ((date.getDay() - weekStart + 7) % 7)),
    };
    const step = steps[event.key];
    if (step) {
      event.preventDefault();
      moveFocus(step());
    }
  };

  const applyPreset = (range: DateRange) => {
    onChange(range);
    const from = range.from && parseIsoDate(range.from);
    if (from) {
      setViewMonth(startOfMonth(from));
      setFocused(from);
    }
  };
  const presetRange = presetRanges(today);

  return (
    <div
      role="group"
      aria-label={label}
      className={cx(styles.picker, className)}
    >
      {presets && (
        <div className={styles.presets}>
          {(Object.keys(text.presets) as (keyof typeof presetRange)[]).map(
            (key) => (
              <button
                key={key}
                type="button"
                className={styles.preset}
                onClick={() => applyPreset(presetRange[key])}
              >
                {text.presets[key]}
              </button>
            ),
          )}
        </div>
      )}
      <div className={styles.header}>
        <button
          type="button"
          className={styles.nav}
          aria-label={text.previousMonth}
          onClick={() => goToMonth(-1)}
        >
          <span aria-hidden="true">‹</span>
        </button>
        <span className={styles.title} aria-live="polite">
          {monthTitle}
        </span>
        <button
          type="button"
          className={styles.nav}
          aria-label={text.nextMonth}
          onClick={() => goToMonth(1)}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
      <table
        ref={gridRef}
        role="grid"
        aria-label={monthTitle}
        className={styles.grid}
      >
        <thead>
          <tr>
            {weekdays.map((day) => (
              <th key={day.long} scope="col" abbr={day.long}>
                {day.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={toIsoDate(week[0]!)}>
              {week.map((date) => {
                const iso = toIsoDate(date);
                const isOutside = date.getMonth() !== viewMonth.getMonth();
                const isEdge = iso === value.from || iso === value.to;
                const isBetween =
                  !isEdge &&
                  value.from !== null &&
                  value.to !== null &&
                  isInRange(iso, value);
                return (
                  <td
                    key={iso}
                    role="gridcell"
                    aria-selected={isEdge || isBetween}
                  >
                    <button
                      type="button"
                      data-iso={iso}
                      aria-label={dayLabel.format(date)}
                      aria-pressed={isEdge}
                      tabIndex={iso === toIsoDate(focused) ? 0 : -1}
                      className={cx(
                        styles.day,
                        isOutside && styles.outside,
                        iso === todayIso && styles.today,
                        isEdge && styles.edge,
                        isBetween && styles.between,
                      )}
                      onClick={() => pick(date)}
                      onKeyDown={(event) => handleKeyDown(event, date)}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.clear}
          disabled={value.from === null && value.to === null}
          onClick={() => onChange({ from: null, to: null })}
        >
          {text.clear}
        </button>
      </div>
    </div>
  );
};
