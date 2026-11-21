import type { HTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import styles from "./Badge.module.css";

export const BADGE_TONES = [
  "neutral",
  "info",
  "success",
  "warning",
  "danger",
] as const;
export type BadgeTone = (typeof BADGE_TONES)[number];

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export const Badge = ({
  tone = "neutral",
  className,
  children,
  ...rest
}: BadgeProps) => (
  <span {...rest} className={cx(styles.badge, styles[tone], className)}>
    {children}
  </span>
);
