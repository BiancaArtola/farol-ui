import { useEffect, useId, useRef, useState } from "react";
import { cx } from "../../utils/classNames";
import { DateRangePicker } from "../DateRangePicker/DateRangePicker";
import {
  parseDateRange,
  parseIsoDate,
  serializeDateRange,
} from "../DateRangePicker/dateRange";
import { useDismiss } from "../../utils/useDismiss";
import styles from "./Table.module.css";

export interface ColumnFilterProps {
  /** Nombre accesible del filtro (también el del botón y el del campo). */
  label: string;
  /** Texto filtrado de la columna; vacío si no hay filtro. */
  value: string;
  onChange: (value: string) => void;
  /**
   * `"text"` (por defecto): un campo de texto. `"date"`: un calendario para elegir un rango; el
   * valor es el texto de `serializeDateRange` y las filas se filtran con `filterRows`.
   */
  type?: "text" | "date";
}

const PANEL_WIDTH = 240;
const DATE_PANEL_WIDTH = 304;
const VIEWPORT_MARGIN = 8;

/**
 * Filtro de una columna: un ícono de embudo junto a la cabecera que abre un panel chico con un
 * campo de texto. El ícono cambia de color y lleva un punto cuando hay un filtro puesto. El panel
 * va con `position: fixed` (calculado desde el ícono) porque el contenedor de la tabla recorta lo
 * que se sale de él; se cierra con Escape, con un clic afuera, con Enter o al desplazar la página.
 */
/** Rango legible ("03/11/2026 – 20/11/2026") para anunciar el filtro de fecha puesto. */
const describeRange = (value: string): string => {
  const range = parseDateRange(value);
  if (!range) {
    return value;
  }
  const format = (iso: string | null) => {
    const date = iso && parseIsoDate(iso);
    return date
      ? new Intl.DateTimeFormat("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(date)
      : "…";
  };
  return `${format(range.from)} – ${format(range.to)}`;
};

export const ColumnFilter = ({
  label,
  value,
  onChange,
  type = "text",
}: ColumnFilterProps) => {
  const panelId = useId();
  const activeId = useId();
  const containerRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const isOpen = position !== null;
  const isActive = value.trim() !== "";
  const isDate = type === "date";
  const panelWidth = isDate ? DATE_PANEL_WIDTH : PANEL_WIDTH;

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
    const maxLeft = window.innerWidth - panelWidth - VIEWPORT_MARGIN;
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
    if (isDate) {
      panelRef.current
        ?.querySelector<HTMLElement>('button[tabindex="0"][data-iso]')
        ?.focus();
    } else {
      inputRef.current?.focus();
    }
    const handleMove = () => setPosition(null);
    window.addEventListener("scroll", handleMove, true);
    window.addEventListener("resize", handleMove);
    return () => {
      window.removeEventListener("scroll", handleMove, true);
      window.removeEventListener("resize", handleMove);
    };
  }, [isOpen, isDate]);

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
        title={
          isActive
            ? `${label}: ${isDate ? describeRange(value) : value}`
            : label
        }
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
          Filtro activo: {isDate ? describeRange(value) : value}
        </span>
      )}
      {position && (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          ref={panelRef}
          className={styles.filterPanel}
          style={{ top: position.top, left: position.left, width: panelWidth }}
        >
          {isDate ? (
            <DateRangePicker
              label={label}
              value={parseDateRange(value) ?? { from: null, to: null }}
              onChange={(range) => onChange(serializeDateRange(range))}
            />
          ) : (
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
          )}
          {isActive && !isDate && (
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
