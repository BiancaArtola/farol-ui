// Filtrado puro de las opciones de un combobox mientras se escribe: sin distinguir
// mayúsculas ni acentos ("jose" encuentra "José"), y las opciones cuyo texto empieza con lo
// escrito van antes que las que solo lo contienen.

export interface FilterableOption {
  label: string;
}

/** Minúsculas y sin tildes, para comparar lo que se escribe con lo que se muestra. */
export const normalizeSearchText = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

export const filterOptions = <Option extends FilterableOption>(
  options: Option[],
  query: string,
): Option[] => {
  const needle = normalizeSearchText(query);
  if (needle === "") {
    return options;
  }
  const startsWith: Option[] = [];
  const contains: Option[] = [];
  for (const option of options) {
    const label = normalizeSearchText(option.label);
    if (label.startsWith(needle)) {
      startsWith.push(option);
    } else if (label.includes(needle)) {
      contains.push(option);
    }
  }
  return [...startsWith, ...contains];
};
