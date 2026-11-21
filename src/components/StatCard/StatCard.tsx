import type { ReactNode } from "react";
import { cx } from "../../utils/classNames";
import styles from "./StatCard.module.css";

export interface StatCardProps {
  label: string;
  value: ReactNode;
  /** Ícono decorativo; el significado lo da la etiqueta. */
  icon?: ReactNode;
  hint?: string;
  /** Si se pasa, la tarjeta es un botón (por ejemplo para filtrar por este dato). */
  onClick?: () => void;
  className?: string;
}

export const StatCard = ({
  label,
  value,
  icon,
  hint,
  onClick,
  className,
}: StatCardProps) => {
  const content = (
    <>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
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
      className={cx(styles.card, styles.interactive, className)}
      onClick={onClick}
    >
      {content}
    </button>
  ) : (
    <div className={cx(styles.card, className)}>{content}</div>
  );
};
