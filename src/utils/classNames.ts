type ClassNamePart = string | false | null | undefined;

/** Une nombres de clase descartando los vacíos y los condicionales apagados. */
export const cx = (...parts: ClassNamePart[]): string =>
  parts.filter(Boolean).join(" ");
