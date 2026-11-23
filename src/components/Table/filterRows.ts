// Filtro por columna para tablas: lógica pura, sin React ni DOM.
import { normalizeSearchText } from "../Combobox/filterOptions";
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

/**
 * Deja las filas que cumplen todos los filtros a la vez (Y). Cada filtro busca el texto
 * dentro del valor de la columna sin distinguir mayúsculas ni acentos, y un número se
 * compara como texto ("120" encuentra 1200). Un valor vacío no coincide con ningún filtro.
 */
export const filterRows = <Row>(
  rows: readonly Row[],
  filters: ColumnFilters,
  getValue: (row: Row, key: string) => SortValue,
): Row[] => {
  const needles = Object.entries(filters)
    .map(([key, text]) => [key, normalizeSearchText(text)] as const)
    .filter(([, needle]) => needle !== "");
  if (needles.length === 0) {
    return [...rows];
  }
  return rows.filter((row) =>
    needles.every(([key, needle]) =>
      normalizeSearchText(String(getValue(row, key) ?? "")).includes(needle),
    ),
  );
};
