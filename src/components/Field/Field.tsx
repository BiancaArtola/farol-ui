import { useId, type ReactNode } from "react";
import { cx } from "../../utils/classNames";
import styles from "./Field.module.css";
import type { FieldOwnProps } from "./fieldProps";

/** Clase compartida por los controles de texto y selección (Input, Textarea, Select). */
export const fieldControlClassName = styles.control;

interface FieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
}

export interface FieldProps extends FieldOwnProps {
  id?: string;
  /** Recibe los atributos de accesibilidad que el control debe llevar. */
  children: (controlProps: FieldControlProps) => ReactNode;
}

/**
 * Envuelve un control con su etiqueta, ayuda y mensaje de error, y le da los atributos
 * que los conectan (id, aria-describedby, aria-invalid). Es interno: se usa desde
 * Input, Textarea y Select para no repetir esta lógica.
 */
export const Field = ({
  label,
  hint,
  error,
  hideLabel = false,
  id: idProp,
  children,
}: FieldProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field}>
      <label
        htmlFor={id}
        className={cx(styles.label, hideLabel && styles.visuallyHidden)}
      >
        {label}
      </label>
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
