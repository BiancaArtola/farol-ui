import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import { cx } from "../../utils/classNames";
import styles from "./Button.module.css";

export const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "ghost",
  "danger",
] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export const BUTTON_SIZES = ["sm", "md", "lg"] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Muestra un indicador y bloquea el botón mientras se espera una respuesta. */
  isLoading?: boolean;
}

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/**
 * Clases de un botón para aplicarlas a otro elemento, por ejemplo el `Link` de Next
 * (`<Link href="/x" className={buttonClassName()}>`), que ya renderiza su propio `<a>`.
 */
export const buttonClassName = ({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}): string =>
  cx(styles.button, styles[variant], styles[size], className);

export interface ButtonLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>, ButtonStyleOptions {
  href: string;
}

/** Un enlace (`<a>`) con el aspecto de un botón: navega o descarga, no ejecuta acciones. */
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink({ variant, size, className, children, ...rest }, ref) {
    return (
      <a
        {...rest}
        ref={ref}
        className={buttonClassName({ variant, size, className })}
      >
        {children}
      </a>
    );
  },
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      type = "button",
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <button
        {...rest}
        ref={ref}
        // type="button" por defecto: dentro de un form no envía sin querer.
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={buttonClassName({ variant, size, className })}
      >
        {isLoading && <span className={styles.spinner} aria-hidden="true" />}
        {children}
      </button>
    );
  },
);
