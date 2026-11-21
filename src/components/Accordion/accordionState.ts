// Estado puro del acordeón: qué secciones quedan abiertas tras hacer clic en una.

/** Alterna `id`; si no se admiten varias abiertas, abrir una cierra las demás. */
export const toggleOpenIds = (
  openIds: readonly string[],
  id: string,
  allowMultiple: boolean,
): string[] => {
  if (openIds.includes(id)) {
    return openIds.filter((openId) => openId !== id);
  }
  return allowMultiple ? [...openIds, id] : [id];
};
