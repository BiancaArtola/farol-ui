import { forwardRef, type InputHTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import { Field, fieldControlClassName } from "../Field/Field";
import { splitFieldProps, type FieldOwnProps } from "../Field/fieldProps";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>, FieldOwnProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    const { fieldProps, controlProps } = splitFieldProps(props);
    const { className, ...rest } = controlProps;

    return (
      <Field {...fieldProps}>
        {(accessibilityProps) => (
          <input
            {...rest}
            {...accessibilityProps}
            ref={ref}
            className={cx(fieldControlClassName, className)}
          />
        )}
      </Field>
    );
  },
);
