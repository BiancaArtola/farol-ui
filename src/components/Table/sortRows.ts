// Orden de filas para tablas: lógica pura, sin React ni DOM.

export const SORT_DIRECTIONS = ["asc", "desc"] as const;
export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export interface TableSort {
  key: string;
  direction: SortDirection;
}

export type SortValue = string | number | null | undefined;

const isEmpty = (value: SortValue): value is null | undefined | "" =>
  value === null || value === undefined || value === "";

const compareValues = (
  first: string | number,
  second: string | number,
): number => {
  if (typeof first === "number" && typeof second === "number") {
    return first - second;
  }
  // sensitivity "base" ignora acentos y mayúsculas; numeric ordena "2" antes que "10".
  return String(first).localeCompare(String(second), undefined, {
    sensitivity: "base",
    numeric: true,
  });
};

/**
 * Al hacer clic en una cabecera: primero ascendente, luego descendente y, a la tercera,
 * vuelve al orden original (null). Clicar otra columna empieza de nuevo en ascendente.
 */
export const nextSort = (
  current: TableSort | null,
  key: string,
): TableSort | null => {
  if (current?.key !== key) {
    return { key, direction: "asc" };
  }
  return current.direction === "asc" ? { key, direction: "desc" } : null;
};

/**
 * Devuelve una copia ordenada. Los valores vacíos van siempre al final, sin importar la
 * dirección: una fila sin dato no tiene que quedar arriba al ordenar de mayor a menor.
 */
export const sortRows = <Row>(
  rows: readonly Row[],
  sort: TableSort | null,
  getValue: (row: Row, key: string) => SortValue,
): Row[] => {
  if (!sort) {
    return [...rows];
  }
  const sign = sort.direction === "asc" ? 1 : -1;
  return [...rows].sort((firstRow, secondRow) => {
    const first = getValue(firstRow, sort.key);
    const second = getValue(secondRow, sort.key);
    if (isEmpty(first) || isEmpty(second)) {
      return Number(isEmpty(first)) - Number(isEmpty(second));
    }
    return sign * compareValues(first, second);
  });
};
