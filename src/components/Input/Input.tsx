import { forwardRef, type InputHTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import { Field, fieldControlClassName } from "../Field/Field";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** La etiqueta es obligatoria: un campo sin nombre no es accesible. */
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, hideLabel, id, className, ...rest },
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
        <input
          {...rest}
          {...controlProps}
          ref={ref}
          className={cx(fieldControlClassName, className)}
        />
      )}
    </Field>
  );
});
