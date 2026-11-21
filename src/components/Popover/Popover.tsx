import type { ReactNode } from "react";
import { cx } from "../../utils/classNames";
import popover from "../../styles/popover.module.css";
import {
  usePopover,
  type PopoverPlacement,
  type PopoverTrigger,
} from "./usePopover";

export { POPOVER_PLACEMENTS } from "./usePopover";
export type { PopoverPlacement, PopoverTrigger } from "./usePopover";

export interface PopoverProps {
  /** El botón que abre y cierra el panel (por ejemplo un `<Button>`). */
  trigger: PopoverTrigger;
  /** Nombre accesible del panel. */
  label: string;
  children: ReactNode;
  placement?: PopoverPlacement;
  className?: string;
}

/**
 * Panel flotante con contenido libre (un formulario corto, filtros, información extra).
 * No bloquea la página: se cierra con Escape o con un clic afuera. Para una lista de
 * acciones usar `DropdownMenu`; para algo que exige respuesta, `Modal`.
 */
export const Popover = ({
  trigger,
  label,
  children,
  placement = "bottom-start",
  className,
}: PopoverProps) => {
  const { panelId, containerRef, isOpen, renderTrigger } = usePopover("dialog");

  return (
    <div ref={containerRef} className={popover.anchor}>
      {renderTrigger(trigger)}
      {isOpen && (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className={cx(popover.panel, popover[placement], className)}
        >
          {children}
        </div>
      )}
    </div>
  );
};
