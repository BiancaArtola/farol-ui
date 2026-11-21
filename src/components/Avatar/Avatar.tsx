import type { HTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import { getInitials } from "./initials";
import styles from "./Avatar.module.css";

export const AVATAR_SIZES = ["sm", "md", "lg"] as const;
export type AvatarSize = (typeof AVATAR_SIZES)[number];

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Nombre completo: de ahí salen las iniciales y el nombre accesible. */
  name: string;
  size?: AvatarSize;
}

export const Avatar = ({
  name,
  size = "md",
  className,
  ...rest
}: AvatarProps) => (
  <span
    {...rest}
    role="img"
    aria-label={name}
    className={cx(styles.avatar, styles[size], className)}
  >
    <span aria-hidden="true">{getInitials(name)}</span>
  </span>
);
