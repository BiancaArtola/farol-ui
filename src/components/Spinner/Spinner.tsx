import type { HTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import styles from "./Spinner.module.css";

export const SPINNER_SIZES = ["sm", "md", "lg"] as const;
export type SpinnerSize = (typeof SPINNER_SIZES)[number];

export interface SpinnerProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  size?: SpinnerSize;
  /** Texto que anuncia el lector de pantalla mientras se espera. */
  label?: string;
}

/** Indicador de carga para una zona de la pantalla (los botones ya traen el suyo con `isLoading`). */
export const Spinner = ({
  size = "md",
  label = "Cargando",
  className,
  ...rest
}: SpinnerProps) => (
  <span
    {...rest}
    role="status"
    aria-label={label}
    className={cx(styles.spinner, styles[size], className)}
  />
);
