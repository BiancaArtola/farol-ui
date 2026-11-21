// Navegación con teclado de una lista de opciones (menú, combobox): flechas para moverse
// (dando la vuelta en los extremos), Inicio/Fin para ir a los extremos, saltando los ítems
// deshabilitados. Sigue los patrones WAI-ARIA "Menu" y "Combobox".
export interface ListTarget {
  disabled?: boolean;
}

const LIST_NAVIGATION_KEYS = ["ArrowDown", "ArrowUp", "Home", "End"] as const;
export type ListNavigationKey = (typeof LIST_NAVIGATION_KEYS)[number];

export const isListNavigationKey = (key: string): key is ListNavigationKey =>
  LIST_NAVIGATION_KEYS.some((navigationKey) => navigationKey === key);

/** Posición del ítem al que hay que mover el foco, o -1 si no hay ninguno habilitado. */
export const getNextEnabledIndex = (
  items: ListTarget[],
  currentIndex: number,
  key: ListNavigationKey,
): number => {
  const enabledIndexes = items.flatMap((item, index) =>
    item.disabled ? [] : [index],
  );
  if (enabledIndexes.length === 0) {
    return -1;
  }
  const position = enabledIndexes.indexOf(currentIndex);

  switch (key) {
    case "Home":
      return enabledIndexes[0];
    case "End":
      return enabledIndexes[enabledIndexes.length - 1];
    case "ArrowDown":
      return enabledIndexes[(position + 1) % enabledIndexes.length];
    case "ArrowUp":
      // Sin ítem enfocado (position -1), ArrowUp va al último, no al penúltimo.
      return enabledIndexes[
        position === -1
          ? enabledIndexes.length - 1
          : (position - 1 + enabledIndexes.length) % enabledIndexes.length
      ];
  }
};
