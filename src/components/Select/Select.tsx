import { forwardRef, type SelectHTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import { Field, fieldControlClassName } from "../Field/Field";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** La etiqueta es obligatoria: un campo sin nombre no es accesible. */
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
}

/** Selector nativo con el estilo de Farol; las opciones van como <option> hijas. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, hint, error, hideLabel, id, className, children, ...rest },
    ref,
  ) {
    return (
      <Field
        label={label}
        hint={hint}
        error={error}
        hideLabel={hideLabel}
        id={id}
      >
        {(controlProps) => (
          <select
            {...rest}
            {...controlProps}
            ref={ref}
            className={cx(fieldControlClassName, className)}
          >
            {children}
          </select>
        )}
      </Field>
    );
  },
);
