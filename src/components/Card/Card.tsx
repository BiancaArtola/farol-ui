import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/classNames";
import type { HeadingLevel } from "../../utils/headingLevel";
import type { IconTone } from "../../utils/tones";
import tones from "../../styles/tones.module.css";
import styles from "./Card.module.css";

export type CardHeadingLevel = HeadingLevel;

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Título visible; se renderiza como encabezado del nivel indicado. */
  title?: string;
  /** Nivel del encabezado: elegirlo según el lugar de la tarjeta en la página. */
  headingLevel?: CardHeadingLevel;
  /** Línea de apoyo bajo el título. */
  description?: string;
  /** Ícono decorativo a la izquierda del título; el significado lo da el título. */
  icon?: ReactNode;
  /** Color del ícono; "info" por defecto. */
  iconTone?: IconTone;
  /** Contenido del pie, por ejemplo acciones. */
  footer?: ReactNode;
}

export const Card = ({
  title,
  headingLevel = 3,
  description,
  icon,
  iconTone = "info",
  footer,
  className,
  children,
  ...rest
}: CardProps) => {
  const Heading = `h${headingLevel}` as const;
  const heading = (
    <>
      {title && <Heading className={styles.title}>{title}</Heading>}
      {description && <p className={styles.description}>{description}</p>}
    </>
  );

  return (
    <article {...rest} className={cx(styles.card, className)}>
      {icon ? (
        <div className={styles.header}>
          <span className={cx(styles.icon, tones[iconTone])} aria-hidden="true">
            {icon}
          </span>
          <div className={styles.headingText}>{heading}</div>
        </div>
      ) : (
        heading
      )}
      <div className={styles.body}>{children}</div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </article>
  );
};
