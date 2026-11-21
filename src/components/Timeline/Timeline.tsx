import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/classNames";
import type { StatusTone } from "../../utils/tones";
import tones from "../../styles/tones.module.css";
import styles from "./Timeline.module.css";

export interface TimelineItem {
  id: string;
  title: string;
  /** Fecha u hora ya formateada, por ejemplo "12 nov, 10:30". */
  time?: string;
  description?: ReactNode;
  /** Color del marcador según el tipo de evento; sin tono, el neutro. */
  tone?: StatusTone;
}

export interface TimelineProps extends Omit<
  HTMLAttributes<HTMLOListElement>,
  "children"
> {
  items: TimelineItem[];
  /** Nombre accesible de la lista de eventos. */
  label: string;
}

export const Timeline = ({
  items,
  label,
  className,
  ...rest
}: TimelineProps) => (
  <ol {...rest} aria-label={label} className={cx(styles.timeline, className)}>
    {items.map((item) => (
      <li key={item.id} className={styles.item}>
        <span
          aria-hidden="true"
          className={cx(
            styles.marker,
            item.tone ? tones[item.tone] : styles.neutral,
          )}
        />
        <div className={styles.content}>
          <span className={styles.title}>{item.title}</span>
          {item.time && <span className={styles.time}>{item.time}</span>}
          {item.description && (
            <div className={styles.description}>{item.description}</div>
          )}
        </div>
      </li>
    ))}
  </ol>
);
