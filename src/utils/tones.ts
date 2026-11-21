// Tonos de estado compartidos por Alert, Toast y Badge: una sola lista y una sola regla de
// cómo se anuncian, para que agregar un tono no obligue a tocar cada componente.

export const STATUS_TONES = ["info", "success", "warning", "danger"] as const;
export type StatusTone = (typeof STATUS_TONES)[number];

/**
 * Rol ARIA con el que se anuncia un aviso: las advertencias y los errores interrumpen
 * al lector de pantalla (alert); el resto se anuncia sin interrumpir (status).
 */
export const getStatusRole = (tone: StatusTone): "alert" | "status" =>
  tone === "warning" || tone === "danger" ? "alert" : "status";

/** Tonos de un ícono (StatCard, Card): los de estado más "neutral", un gris sin significado. */
export const ICON_TONES = ["neutral", ...STATUS_TONES] as const;
export type IconTone = (typeof ICON_TONES)[number];
