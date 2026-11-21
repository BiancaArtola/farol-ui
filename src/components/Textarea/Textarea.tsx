import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import { Field, fieldControlClassName } from "../Field/Field";
import { splitFieldProps, type FieldOwnProps } from "../Field/fieldProps";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldOwnProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    const { fieldProps, controlProps } = splitFieldProps(props);
    const { className, rows = 4, ...rest } = controlProps;

    return (
      <Field {...fieldProps}>
        {(accessibilityProps) => (
          <textarea
            {...rest}
            {...accessibilityProps}
            ref={ref}
            rows={rows}
            className={cx(fieldControlClassName, className)}
          />
        )}
      </Field>
    );
  },
);
