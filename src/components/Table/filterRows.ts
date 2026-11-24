// Filtro por columna para tablas: lógica pura, sin React ni DOM.
import { normalizeSearchText } from "../Combobox/filterOptions";
import {
  isInRange,
  parseDateRange,
  parseIsoDate,
  toIsoDate,
} from "../DateRangePicker/dateRange";
import type { SortValue } from "./sortRows";

/** Texto escrito en el filtro de cada columna, por la clave de la columna. */
export type ColumnFilters = Readonly<Record<string, string>>;

/**
 * Devuelve el filtro con el valor de una columna cambiado. Un valor vacío (o solo espacios)
 * quita la clave, así `hasActiveFilters` y la comparación de filtros no ven columnas fantasma.
 */
export const setColumnFilter = (
  filters: ColumnFilters,
  key: string,
  value: string,
): ColumnFilters => {
  const others = Object.fromEntries(
    Object.entries(filters).filter(([name]) => name !== key),
  );
  return value.trim() === "" ? others : { ...others, [key]: value };
};

/** Valor de una celda para filtrar: texto, número o una fecha (`Date` o "AAAA-MM-DD"). */
export type FilterValue = SortValue | Date;

/** "AAAA-MM-DD" del valor si es una fecha (un `Date` o un texto ISO real); `null` si no. */
const toIsoOrNull = (value: FilterValue): string | null => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : toIsoDate(value);
  }
  return typeof value === "string" && parseIsoDate(value) ? value : null;
};

/**
 * Deja las filas que cumplen todos los filtros a la vez (Y). Cada filtro busca el texto
 * dentro del valor de la columna sin distinguir mayúsculas ni acentos, y un número se
 * compara como texto ("120" encuentra 1200). Un valor vacío no coincide con ningún filtro.
 * Si el filtro es un rango de fechas (el texto de `serializeDateRange`, que escribe el filtro
 * de fecha de la tabla), la celda tiene que ser una fecha dentro del rango; sin fecha no coincide.
 */
export const filterRows = <Row>(
  rows: readonly Row[],
  filters: ColumnFilters,
  getValue: (row: Row, key: string) => FilterValue,
): Row[] => {
  const matchers = Object.entries(filters)
    .map(([key, text]) => {
      const range = parseDateRange(text);
      if (range) {
        return (row: Row) => {
          const iso = toIsoOrNull(getValue(row, key));
          return iso !== null && isInRange(iso, range);
        };
      }
      const needle = normalizeSearchText(text);
      return needle === ""
        ? null
        : (row: Row) => {
            const value = getValue(row, key);
            return normalizeSearchText(
              String(value instanceof Date ? toIsoDate(value) : (value ?? "")),
            ).includes(needle);
          };
    })
    .filter((matcher) => matcher !== null);
  if (matchers.length === 0) {
    return [...rows];
  }
  return rows.filter((row) => matchers.every((matches) => matches(row)));
};
