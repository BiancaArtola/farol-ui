// Qué números mostrar en una paginación: primera, última, la actual y sus vecinas, con
// puntos suspensivos donde se saltean páginas. Siempre devuelve la misma cantidad de
// elementos cuando hay muchas páginas, para que la barra no "salte" al navegar.

export type PageItem = number | "ellipsis-start" | "ellipsis-end";

const range = (first: number, last: number): number[] =>
  Array.from({ length: last - first + 1 }, (_, offset) => first + offset);

export const getPageItems = (
  page: number,
  pageCount: number,
  siblings = 1,
): PageItem[] => {
  if (pageCount <= 0) {
    return [];
  }
  const current = Math.min(Math.max(page, 1), pageCount);
  // Primera, última, actual, vecinas de cada lado y dos lugares para los puntos.
  const slots = siblings * 2 + 5;
  if (pageCount <= slots) {
    return range(1, pageCount);
  }

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, pageCount);
  const hasStartEllipsis = left > 3;
  const hasEndEllipsis = right < pageCount - 2;
  const edgeCount = 3 + siblings * 2;

  if (!hasStartEllipsis) {
    return [...range(1, edgeCount), "ellipsis-end", pageCount];
  }
  if (!hasEndEllipsis) {
    return [
      1,
      "ellipsis-start",
      ...range(pageCount - edgeCount + 1, pageCount),
    ];
  }
  return [
    1,
    "ellipsis-start",
    ...range(left, right),
    "ellipsis-end",
    pageCount,
  ];
};
