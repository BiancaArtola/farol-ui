import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cx } from "../../utils/classNames";
import { DateRangePicker } from "../DateRangePicker/DateRangePicker";
import {
  formatDateRange,
  parseDateRange,
  serializeDateRange,
} from "../DateRangePicker/dateRange";
import { useDismiss } from "../../utils/useDismiss";
import { FILTER_TYPES, type TableFilterType } from "./filterTypes";
import {
  computePanelPosition,
  isAnchorVisible,
  type PanelPosition,
} from "./panelPosition";
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
  type?: TableFilterType;
}

// El calendario trae su propio ancho; solo el campo de texto necesita uno fijo.
const TEXT_PANEL_WIDTH = 240;

/** Texto del filtro puesto: un rango de fechas se anuncia legible y no como "AAAA-MM-DD..". */
const describeFilter = (value: string, type: TableFilterType): string => {
  const range = type === FILTER_TYPES.date ? parseDateRange(value) : null;
  return range ? formatDateRange(range) : value;
};

/**
 * Filtro de una columna: un ícono de embudo junto a la cabecera que abre un panel chico con un
 * campo de texto o un calendario. El ícono cambia de color y lleva un punto cuando hay un filtro
 * puesto. El panel va con `position: fixed` (calculado desde el ícono) porque el contenedor de la
 * tabla recorta lo que se sale de él; se cierra con Escape, con un clic afuera, con Enter en el
 * campo de texto o cuando el ícono sale de la pantalla.
 */
export const ColumnFilter = ({
  label,
  value,
  onChange,
  type = FILTER_TYPES.text,
}: ColumnFilterProps) => {
  const panelId = useId();
  const activeId = useId();
  const containerRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  // `null` mientras no se midió: el panel necesita estar dibujado para saber cuánto ocupa.
  const [position, setPosition] = useState<PanelPosition | null>(null);
  const isActive = value.trim() !== "";
  const isDate = type === FILTER_TYPES.date;
  const activeText = describeFilter(value, type);

  const close = (restoreFocus: boolean) => {
    setIsOpen(false);
    if (restoreFocus) {
      buttonRef.current?.focus();
    }
  };

  const toggle = () => {
    if (isOpen) {
      close(false);
    } else {
      setPosition(null);
      setIsOpen(true);
    }
  };

  useDismiss(isOpen, containerRef, (reason) => close(reason === "escape"));

  const placePanel = useCallback(() => {
    const anchor = buttonRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) {
      return;
    }
    setPosition(
      computePanelPosition({
        anchor: anchor.getBoundingClientRect(),
        // El alto natural: con un `maxHeight` ya puesto, `offsetHeight` viene recortado.
        panel: {
          width: panel.offsetWidth,
          height: panel.scrollHeight + panel.offsetHeight - panel.clientHeight,
        },
        viewport: { width: window.innerWidth, height: window.innerHeight },
      }),
    );
  }, []);

  // Antes de pintar, para que el panel no se vea saltar de lugar.
  useLayoutEffect(() => {
    if (isOpen) {
      placePanel();
    }
    // Con un filtro puesto aparece "Limpiar filtro" y el panel crece: hay que volver a ubicarlo.
  }, [isOpen, isActive, placePanel]);

  // Con el panel abierto el campo recibe el foco, y el panel sigue al ícono si la página se mueve.
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
    const handleMove = (event: Event) => {
      // El scroll del propio panel (cuando no entra en la ventana) no lo mueve.
      const { target } = event;
      if (target instanceof Node && panelRef.current?.contains(target)) {
        return;
      }
      // No se cierra ante cualquier scroll: al filtrar, la tabla se acorta y el navegador mueve
      // la página solo, justo cuando falta elegir el "hasta".
      const anchor = buttonRef.current?.getBoundingClientRect();
      if (anchor && isAnchorVisible(anchor, { height: window.innerHeight })) {
        placePanel();
      } else {
        setIsOpen(false);
      }
    };
    window.addEventListener("scroll", handleMove, true);
    window.addEventListener("resize", handleMove);
    return () => {
      window.removeEventListener("scroll", handleMove, true);
      window.removeEventListener("resize", handleMove);
    };
  }, [isOpen, isDate, placePanel]);

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
        title={isActive ? `${label}: ${activeText}` : label}
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
          Filtro activo: {activeText}
        </span>
      )}
      {isOpen && (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          ref={panelRef}
          className={styles.filterPanel}
          style={{
            ...(position ?? { top: 0, left: 0 }),
            width: isDate ? undefined : TEXT_PANEL_WIDTH,
          }}
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
