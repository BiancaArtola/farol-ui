import { useEffect, useId, useRef, useState } from "react";
import { cx } from "../../utils/classNames";
import { useDismiss } from "../../utils/useDismiss";
import styles from "./Table.module.css";

export interface ColumnFilterProps {
  /** Nombre accesible del filtro (también el del botón y el del campo). */
  label: string;
  /** Texto filtrado de la columna; vacío si no hay filtro. */
  value: string;
  onChange: (value: string) => void;
}

const PANEL_WIDTH = 240;
const VIEWPORT_MARGIN = 8;

/**
 * Filtro de una columna: un ícono de embudo junto a la cabecera que abre un panel chico con un
 * campo de texto. El ícono cambia de color y lleva un punto cuando hay un filtro puesto. El panel
 * va con `position: fixed` (calculado desde el ícono) porque el contenedor de la tabla recorta lo
 * que se sale de él; se cierra con Escape, con un clic afuera, con Enter o al desplazar la página.
 */
export const ColumnFilter = ({ label, value, onChange }: ColumnFilterProps) => {
  const panelId = useId();
  const activeId = useId();
  const containerRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const isOpen = position !== null;
  const isActive = value.trim() !== "";

  const close = (restoreFocus: boolean) => {
    setPosition(null);
    if (restoreFocus) {
      buttonRef.current?.focus();
    }
  };

  const toggle = () => {
    if (isOpen) {
      close(false);
      return;
    }
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    // Pegado al ícono, sin salirse de la ventana por la derecha.
    const maxLeft = window.innerWidth - PANEL_WIDTH - VIEWPORT_MARGIN;
    setPosition({
      top: rect.bottom + 4,
      left: Math.max(VIEWPORT_MARGIN, Math.min(rect.left, maxLeft)),
    });
  };

  useDismiss(isOpen, containerRef, (reason) => close(reason === "escape"));

  // Con el panel abierto el campo recibe el foco, y el panel no sigue al ícono si la página se mueve.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    inputRef.current?.focus();
    const handleMove = () => setPosition(null);
    window.addEventListener("scroll", handleMove, true);
    window.addEventListener("resize", handleMove);
    return () => {
      window.removeEventListener("scroll", handleMove, true);
      window.removeEventListener("resize", handleMove);
    };
  }, [isOpen]);

  return (
    <span ref={containerRef} className={styles.columnFilter}>
      <button
        ref={buttonRef}
        type="button"
        className={cx(styles.filterButton, isActive && styles.filterActive)}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        aria-describedby={isActive ? activeId : undefined}
        title={isActive ? `${label}: ${value}` : label}
        onClick={toggle}
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 5h18l-7 8v6l-4 2v-8z" />
        </svg>
        {isActive && <span aria-hidden="true" className={styles.filterDot} />}
      </button>
      {isActive && (
        <span id={activeId} className={styles.visuallyHidden}>
          Filtro activo: {value}
        </span>
      )}
      {position && (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className={styles.filterPanel}
          style={{ top: position.top, left: position.left, width: PANEL_WIDTH }}
        >
          <input
            ref={inputRef}
            type="search"
            className={styles.filterInput}
            aria-label={label}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                close(true);
              }
            }}
          />
          {isActive && (
            <button
              type="button"
              className={styles.filterClear}
              onClick={() => {
                onChange("");
                inputRef.current?.focus();
              }}
            >
              Limpiar filtro
            </button>
          )}
        </div>
      )}
    </span>
  );
};
