import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/classNames";
import styles from "./Alert.module.css";

export const ALERT_TONES = ["info", "success", "warning", "danger"] as const;
export type AlertTone = (typeof ALERT_TONES)[number];

export interface AlertProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  tone?: AlertTone;
  title?: ReactNode;
}

// Los avisos graves se anuncian de inmediato (alert); el resto, sin interrumpir (status).
const INTERRUPTING_TONES: readonly AlertTone[] = ["warning", "danger"];

export const Alert = ({
  tone = "info",
  title,
  className,
  children,
  ...rest
}: AlertProps) => (
  <div
    role={INTERRUPTING_TONES.includes(tone) ? "alert" : "status"}
    {...rest}
    className={cx(styles.alert, styles[tone], className)}
  >
    {title && <p className={styles.title}>{title}</p>}
    <div>{children}</div>
  </div>
);
