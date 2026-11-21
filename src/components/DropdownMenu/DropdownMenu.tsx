import { useEffect, useRef, type KeyboardEvent } from "react";
import { cx } from "../../utils/classNames";
import popover from "../../styles/popover.module.css";
import {
  usePopover,
  type PopoverPlacement,
  type PopoverTrigger,
} from "../Popover/usePopover";
import { getNextMenuIndex, isMenuNavigationKey } from "./menuNavigation";
import styles from "./DropdownMenu.module.css";

export interface DropdownMenuItem {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  /** "danger" marca acciones destructivas (eliminar, cerrar sesión). */
  tone?: "default" | "danger";
}

export interface DropdownMenuProps {
  /** El botón que abre y cierra el menú. */
  trigger: PopoverTrigger;
  items: DropdownMenuItem[];
  /** Nombre accesible del menú. */
  label: string;
  placement?: PopoverPlacement;
  className?: string;
}

/**
 * Menú de acciones que se abre desde un botón. Teclado: flechas, Inicio y Fin para
 * moverse; Enter o Espacio para elegir; Escape para cerrar devolviendo el foco al botón.
 */
export const DropdownMenu = ({
  trigger,
  items,
  label,
  placement = "bottom-start",
  className,
}: DropdownMenuProps) => {
  const { panelId, containerRef, isOpen, close, renderTrigger } =
    usePopover("menu");
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Al abrir, el foco pasa al primer ítem habilitado para poder usar las flechas enseguida.
  useEffect(() => {
    if (isOpen) {
      const first = getNextMenuIndex(items, -1, "Home");
      itemRefs.current[first]?.focus();
    }
    // Solo al abrir: si `items` cambia con el menú abierto no hay que mover el foco.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") {
      close(false);
      return;
    }
    if (!isMenuNavigationKey(event.key)) {
      return;
    }
    event.preventDefault();
    const current = itemRefs.current.findIndex(
      (element) => element === document.activeElement,
    );
    itemRefs.current[getNextMenuIndex(items, current, event.key)]?.focus();
  };

  const select = (item: DropdownMenuItem) => {
    close(true);
    item.onSelect();
  };

  return (
    <div ref={containerRef} className={popover.anchor}>
      {renderTrigger(trigger)}
      {isOpen && (
        <div
          id={panelId}
          role="menu"
          tabIndex={-1}
          aria-label={label}
          className={cx(
            popover.panel,
            popover[placement],
            styles.menu,
            className,
          )}
          onKeyDown={handleKeyDown}
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              type="button"
              role="menuitem"
              tabIndex={-1}
              disabled={item.disabled}
              className={cx(
                styles.item,
                item.tone === "danger" && styles.danger,
              )}
              onClick={() => select(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
