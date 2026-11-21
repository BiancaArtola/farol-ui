import {
  cloneElement,
  useId,
  useState,
  type KeyboardEvent,
  type ReactElement,
} from "react";
import { cx } from "../../utils/classNames";
import styles from "./Tooltip.module.css";

export const TOOLTIP_PLACEMENTS = ["top", "bottom", "left", "right"] as const;
export type TooltipPlacement = (typeof TOOLTIP_PLACEMENTS)[number];

export interface TooltipProps {
  /** Texto corto de ayuda. Nada interactivo: el tooltip no recibe foco. */
  content: string;
  /** El elemento que lo dispara, normalmente un botón o un ícono con foco. */
  children: ReactElement<{ "aria-describedby"?: string }>;
  placement?: TooltipPlacement;
  className?: string;
}

/**
 * Ayuda breve al pasar el mouse o enfocar con el teclado; Escape la oculta. Complementa al
 * elemento, no lo reemplaza: un botón de solo ícono sigue necesitando su `aria-label`.
 */
export const Tooltip = ({
  content,
  children,
  placement = "top",
  className,
}: TooltipProps) => {
  const tooltipId = useId();
  const [isOpen, setIsOpen] = useState(false);
  // Suma el tooltip a lo que el hijo ya tuviera (por ejemplo la ayuda de su campo).
  const describedBy =
    [children.props["aria-describedby"], isOpen ? tooltipId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Escape" && isOpen) {
      setIsOpen(false);
    }
  };

  return (
    // Los eventos son de ayuda visual sobre un hijo que ya es interactivo; no es un control.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span
      className={styles.anchor}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
      onKeyDown={handleKeyDown}
    >
      {cloneElement(children, { "aria-describedby": describedBy })}
      {isOpen && (
        <span
          id={tooltipId}
          role="tooltip"
          className={cx(styles.tooltip, styles[placement], className)}
        >
          {content}
        </span>
      )}
    </span>
  );
};
