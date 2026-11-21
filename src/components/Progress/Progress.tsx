import type { HTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import { clampProgress, getProgressPercent } from "./progressValue";
import styles from "./Progress.module.css";

export const PROGRESS_TONES = [
  "primary",
  "success",
  "warning",
  "danger",
] as const;
export type ProgressTone = (typeof PROGRESS_TONES)[number];

export interface ProgressProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Qué se está midiendo (nombre accesible), por ejemplo "Importación". */
  label: string;
  /** Avance actual; sin valor la barra es indeterminada (no se sabe cuánto falta). */
  value?: number;
  max?: number;
  tone?: ProgressTone;
  /** Muestra el porcentaje a la derecha de la etiqueta. */
  showValue?: boolean;
}

export const Progress = ({
  label,
  value,
  max = 100,
  tone = "primary",
  showValue = false,
  className,
  ...rest
}: ProgressProps) => {
  const isIndeterminate = value === undefined;
  const percent = isIndeterminate ? 0 : getProgressPercent(value, max);

  return (
    <div {...rest} className={cx(styles.progress, className)}>
      <div className={styles.header}>
        <span>{label}</span>
        {showValue && !isIndeterminate && <span>{percent}%</span>}
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={isIndeterminate ? undefined : clampProgress(value, max)}
        className={styles.track}
      >
        <div
          className={cx(
            styles.fill,
            styles[tone],
            isIndeterminate && styles.indeterminate,
          )}
          style={isIndeterminate ? undefined : { width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
