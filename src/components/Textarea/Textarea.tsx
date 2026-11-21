import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import { Field, fieldControlClassName } from "../Field/Field";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** La etiqueta es obligatoria: un campo sin nombre no es accesible. */
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, hint, error, hideLabel, id, className, rows = 4, ...rest },
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
          <textarea
            {...rest}
            {...controlProps}
            ref={ref}
            rows={rows}
            className={cx(fieldControlClassName, className)}
          />
        )}
      </Field>
    );
  },
);
