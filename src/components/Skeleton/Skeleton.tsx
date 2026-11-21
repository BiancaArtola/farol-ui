import type { HTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import styles from "./Skeleton.module.css";

export const SKELETON_SHAPES = ["text", "rect", "circle"] as const;
export type SkeletonShape = (typeof SKELETON_SHAPES)[number];

export interface SkeletonProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  shape?: SkeletonShape;
  /** Ancho: número en píxeles o cualquier medida CSS (`"60%"`). */
  width?: number | string;
  height?: number | string;
}

/**
 * Marcador de posición mientras llega el contenido. Es decorativo (`aria-hidden`): el
 * contenedor que lo usa debe avisar la espera, por ejemplo con `aria-busy="true"`.
 */
export const Skeleton = ({
  shape = "text",
  width,
  height,
  className,
  style,
  ...rest
}: SkeletonProps) => (
  <span
    {...rest}
    aria-hidden="true"
    className={cx(styles.skeleton, styles[shape], className)}
    style={{ width, height, ...style }}
  />
);
