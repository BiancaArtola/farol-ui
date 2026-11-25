/** Cómo se escribe el filtro de una columna: un campo de texto o un calendario de rango. */
export const FILTER_TYPES = { text: "text", date: "date" } as const;
export type TableFilterType = (typeof FILTER_TYPES)[keyof typeof FILTER_TYPES];
