import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/classNames";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title: string;
  description?: string;
  /** Acción para salir del estado vacío, por ejemplo un botón "Agregar". */
  action?: ReactNode;
}

export const EmptyState = ({
  title,
  description,
  action,
  className,
  ...rest
}: EmptyStateProps) => (
  <div {...rest} className={cx(styles.emptyState, className)}>
    <p className={styles.title}>{title}</p>
    {description && <p className={styles.description}>{description}</p>}
    {action}
  </div>
);
