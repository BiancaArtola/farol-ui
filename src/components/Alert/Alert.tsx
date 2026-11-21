import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/classNames";
import {
  STATUS_TONES,
  getStatusRole,
  type StatusTone,
} from "../../utils/tones";
import tones from "../../styles/tones.module.css";
import styles from "./Alert.module.css";

export const ALERT_TONES = STATUS_TONES;
export type AlertTone = StatusTone;

export interface AlertProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  tone?: AlertTone;
  title?: ReactNode;
}

export const Alert = ({
  tone = "info",
  title,
  className,
  children,
  ...rest
}: AlertProps) => (
  <div
    role={getStatusRole(tone)}
    {...rest}
    className={cx(styles.alert, tones[tone], className)}
  >
    {title && <p className={styles.title}>{title}</p>}
    <div>{children}</div>
  </div>
);
