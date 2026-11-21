import { cx } from "../../utils/classNames";
import styles from "./CloseButton.module.css";

interface CloseButtonProps {
  /** Texto accesible del botón (viene del componente que lo usa para poder traducirlo). */
  label: string;
  onClick: () => void;
  size?: "sm" | "md";
  /** "inherit" toma el color del contenedor (Toast); "muted" va atenuado (Modal). */
  tone?: "inherit" | "muted";
}

/**
 * Botón "×" de Modal y Toast. Es interno: así el foco visible, el tamaño del área
 * clicable y el aria-hidden del símbolo se resuelven una sola vez.
 */
export const CloseButton = ({
  label,
  onClick,
  size = "md",
  tone = "muted",
}: CloseButtonProps) => (
  <button
    type="button"
    className={cx(styles.close, styles[size], styles[tone])}
    aria-label={label}
    onClick={onClick}
  >
    <span aria-hidden="true">×</span>
  </button>
);
