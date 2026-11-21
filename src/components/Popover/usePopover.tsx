import {
  cloneElement,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactElement,
} from "react";
import { useDismiss } from "../../utils/useDismiss";

export const POPOVER_PLACEMENTS = [
  "bottom-start",
  "bottom-end",
  "top-start",
  "top-end",
] as const;
export type PopoverPlacement = (typeof POPOVER_PLACEMENTS)[number];

/** Lo que el disparador tiene que aceptar: un botón (o algo que se comporte como uno). */
interface PopoverTriggerProps {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-haspopup"?: "dialog" | "menu";
}

export type PopoverTrigger = ReactElement<PopoverTriggerProps>;

/**
 * Estado compartido por Popover y DropdownMenu: abrir/cerrar, cerrar con Escape o clic
 * fuera, devolver el foco al disparador y conectar el disparador con el panel (ARIA).
 */
export const usePopover = (popupRole: "dialog" | "menu") => {
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const focusTrigger = () =>
    containerRef.current
      ?.querySelector<HTMLElement>("[aria-haspopup]")
      ?.focus();

  const close = (shouldRestoreFocus: boolean) => {
    setIsOpen(false);
    if (shouldRestoreFocus) {
      focusTrigger();
    }
  };

  useDismiss(isOpen, containerRef, (reason) => close(reason === "escape"));

  const renderTrigger = (trigger: PopoverTrigger): PopoverTrigger =>
    cloneElement(trigger, {
      "aria-haspopup": popupRole,
      "aria-expanded": isOpen,
      "aria-controls": isOpen ? panelId : undefined,
      onClick: (event: MouseEvent<HTMLElement>) => {
        trigger.props.onClick?.(event);
        setIsOpen(!isOpen);
      },
    });

  return { panelId, containerRef, isOpen, close, renderTrigger };
};
