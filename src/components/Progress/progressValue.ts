// Cálculo puro del avance: acota el valor para que una cuenta desbordada (110 de 100) no
// rompa la barra ni los atributos ARIA.

/** Valor acotado entre 0 y `max`. */
export const clampProgress = (value: number, max: number): number =>
  Math.min(Math.max(value, 0), max);

/** Porcentaje entero (0 a 100) de `value` sobre `max`; 0 si `max` no es positivo. */
export const getProgressPercent = (value: number, max: number): number =>
  max > 0 ? Math.round((clampProgress(value, max) / max) * 100) : 0;
