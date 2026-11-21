import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/classNames";
import type { HeadingLevel } from "../../utils/headingLevel";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title: string;
  /** Con un nivel, el título es un encabezado (para pantallas enteras sin datos); sin él, un párrafo. */
  headingLevel?: HeadingLevel;
  description?: string;
  /** Ícono decorativo sobre el título; el significado lo da el texto. */
  icon?: ReactNode;
  /** Acción para salir del estado vacío, por ejemplo un botón "Agregar". */
  action?: ReactNode;
}

export const EmptyState = ({
  title,
  headingLevel,
  description,
  icon,
  action,
  className,
  ...rest
}: EmptyStateProps) => {
  const Title = headingLevel ? (`h${headingLevel}` as const) : "p";

  return (
    <div {...rest} className={cx(styles.emptyState, className)}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <Title className={styles.title}>{title}</Title>
      {description && <p className={styles.description}>{description}</p>}
      {action}
    </div>
  );
};
