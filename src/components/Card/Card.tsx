import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/classNames";
import styles from "./Card.module.css";

export type CardHeadingLevel = 2 | 3 | 4;

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Título visible; se renderiza como encabezado del nivel indicado. */
  title?: string;
  /** Nivel del encabezado: elegirlo según el lugar de la tarjeta en la página. */
  headingLevel?: CardHeadingLevel;
  /** Contenido del pie, por ejemplo acciones. */
  footer?: ReactNode;
}

export const Card = ({
  title,
  headingLevel = 3,
  footer,
  className,
  children,
  ...rest
}: CardProps) => {
  const Heading = `h${headingLevel}` as const;

  return (
    <article {...rest} className={cx(styles.card, className)}>
      {title && <Heading className={styles.title}>{title}</Heading>}
      <div className={styles.body}>{children}</div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </article>
  );
};
