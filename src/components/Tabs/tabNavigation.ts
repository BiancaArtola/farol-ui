// Navegación con teclado de las pestañas, como en el patrón WAI-ARIA de "Tabs":
// flechas para moverse, Inicio/Fin para ir a los extremos, saltando las deshabilitadas.

export interface TabTarget {
  id: string;
  disabled?: boolean;
}

const TAB_NAVIGATION_KEYS = ["ArrowRight", "ArrowLeft", "Home", "End"] as const;
export type TabNavigationKey = (typeof TAB_NAVIGATION_KEYS)[number];

export const isTabNavigationKey = (key: string): key is TabNavigationKey =>
  TAB_NAVIGATION_KEYS.some((navigationKey) => navigationKey === key);

/** Devuelve el id de la pestaña que corresponde activar, o null si no hay ninguna. */
export const getNextTabId = (
  tabs: TabTarget[],
  currentId: string,
  key: TabNavigationKey,
): string | null => {
  const enabledTabs = tabs.filter((tab) => !tab.disabled);
  if (enabledTabs.length === 0) {
    return null;
  }
  const currentIndex = enabledTabs.findIndex((tab) => tab.id === currentId);

  switch (key) {
    case "Home":
      return enabledTabs[0].id;
    case "End":
      return enabledTabs[enabledTabs.length - 1].id;
    case "ArrowRight":
      return enabledTabs[(currentIndex + 1) % enabledTabs.length].id;
    case "ArrowLeft":
      return enabledTabs[
        (currentIndex - 1 + enabledTabs.length) % enabledTabs.length
      ].id;
  }
};
