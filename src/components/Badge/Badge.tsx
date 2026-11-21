import type { HTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import { STATUS_TONES } from "../../utils/tones";
import tones from "../../styles/tones.module.css";
import styles from "./Badge.module.css";

export const BADGE_TONES = ["neutral", ...STATUS_TONES] as const;
export type BadgeTone = (typeof BADGE_TONES)[number];

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

// "neutral" es propio del Badge; los demás tonos salen del CSS compartido de estados.
const getToneClass = (tone: BadgeTone): string =>
  tone === "neutral" ? styles.neutral : tones[tone];

export const Badge = ({
  tone = "neutral",
  className,
  children,
  ...rest
}: BadgeProps) => (
  <span {...rest} className={cx(styles.badge, getToneClass(tone), className)}>
    {children}
  </span>
);
