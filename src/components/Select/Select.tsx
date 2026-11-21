import { forwardRef, type SelectHTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import { Field, fieldControlClassName } from "../Field/Field";
import { splitFieldProps, type FieldOwnProps } from "../Field/fieldProps";

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>, FieldOwnProps {}

/** Selector nativo con el estilo de Farol; las opciones van como <option> hijas. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(props, ref) {
    const { fieldProps, controlProps } = splitFieldProps(props);
    const { className, children, ...rest } = controlProps;

    return (
      <Field {...fieldProps}>
        {(accessibilityProps) => (
          <select
            {...rest}
            {...accessibilityProps}
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
