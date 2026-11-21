import type { ReactNode } from "react";
import { cx } from "../../utils/classNames";
import type { IconTone } from "../../utils/tones";
import tones from "../../styles/tones.module.css";
import styles from "./StatCard.module.css";

export interface StatCardProps {
  label: string;
  value: ReactNode;
  /** Ícono decorativo; el significado lo da la etiqueta. */
  icon?: ReactNode;
  hint?: string;
  /** Color del ícono; "info" por defecto. */
  tone?: IconTone;
  /** Si se pasa, la tarjeta es un botón (por ejemplo para filtrar por este dato). */
  onClick?: () => void;
  /** Con `onClick`: marca el filtro puesto (resalta la tarjeta y se anuncia como presionada). */
  isActive?: boolean;
  className?: string;
}

export const StatCard = ({
  label,
  value,
  icon,
  hint,
  tone = "info",
  onClick,
  isActive = false,
  className,
}: StatCardProps) => {
  const content = (
    <>
      {icon && (
        <span className={cx(styles.icon, tones[tone])} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </span>
    </>
  );

  return onClick ? (
    <button
      type="button"
      className={cx(
        styles.card,
        styles.interactive,
        isActive && styles.active,
        className,
      )}
      aria-pressed={isActive}
      onClick={onClick}
    >
      {content}
    </button>
  ) : (
    <div className={cx(styles.card, className)}>{content}</div>
  );
};
