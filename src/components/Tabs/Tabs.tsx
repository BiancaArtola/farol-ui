import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/classNames";
import { getNextTabId, isTabNavigationKey } from "./tabNavigation";
import styles from "./Tabs.module.css";

export interface TabItem {
  id: string;
  /** Texto o contenido de la pestaña (por ejemplo un ícono y un texto). */
  label: ReactNode;
  /**
   * Contenido del panel. Se puede omitir cuando la pantalla de abajo la dibuja la app (la
   * pestaña solo cambia de vista): entonces no se renderiza ningún panel.
   */
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** Pestaña inicial; por defecto, la primera habilitada. */
  defaultTabId?: string;
  /**
   * Pestaña activa cuando la controla la app (por ejemplo la vista actual, que también cambia
   * desde otros lugares). Con este valor, `onChange` avisa y la app decide.
   */
  activeTabId?: string;
  /** Nombre accesible del grupo de pestañas. */
  label: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export const Tabs = ({
  items,
  defaultTabId,
  activeTabId,
  label,
  onChange,
  className,
}: TabsProps) => {
  const baseId = useId();
  const firstEnabledId = items.find((item) => !item.disabled)?.id ?? "";
  const [ownActiveId, setActiveId] = useState(defaultTabId ?? firstEnabledId);
  const activeId = activeTabId ?? ownActiveId;
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  const activate = (tabId: string) => {
    setActiveId(tabId);
    onChange?.(tabId);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isTabNavigationKey(event.key)) {
      return;
    }
    const nextId = getNextTabId(items, activeId, event.key);
    if (nextId === null) {
      return;
    }
    event.preventDefault();
    // Activación automática: al mover el foco con flechas también se muestra el panel.
    activate(nextId);
    tabRefs.current.get(nextId)?.focus();
  };

  const activeItem = items.find((item) => item.id === activeId);

  return (
    <div className={cx(styles.tabs, className)}>
      {/* El teclado se maneja en el contenedor: los eventos suben desde cada pestaña. */}
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
      <div
        role="tablist"
        aria-label={label}
        className={styles.list}
        onKeyDown={handleKeyDown}
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              ref={(node) => {
                if (node) {
                  tabRefs.current.set(item.id, node);
                } else {
                  tabRefs.current.delete(item.id);
                }
              }}
              id={`${baseId}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={
                item.content === undefined
                  ? undefined
                  : `${baseId}-panel-${item.id}`
              }
              // Solo la pestaña activa entra en la secuencia de Tab; el resto, con flechas.
              tabIndex={isActive ? 0 : -1}
              disabled={item.disabled}
              className={cx(styles.tab, isActive && styles.active)}
              onClick={() => activate(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {activeItem && activeItem.content !== undefined && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${activeItem.id}`}
          aria-labelledby={`${baseId}-tab-${activeItem.id}`}
          tabIndex={0}
          className={styles.panel}
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
};
