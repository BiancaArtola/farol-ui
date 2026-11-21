// Iniciales de un nombre para el Avatar: lógica pura.

/** "María del Carmen Gómez" → "MG" (primera y última palabra); "Ana" → "A"; vacío → "?". */
export const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "?";
  }
  const first = words[0];
  const last = words.length > 1 ? words[words.length - 1] : "";
  return `${first[0]}${last[0] ?? ""}`.toUpperCase();
};
