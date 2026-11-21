import { forwardRef, type InputHTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import { ChoiceField } from "../ChoiceField/ChoiceField";
import styles from "./Checkbox.module.css";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
  hint?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, hint, id, className, ...rest }, ref) {
    return (
      <ChoiceField label={label} hint={hint} id={id}>
        {(controlProps) => (
          <input
            {...rest}
            {...controlProps}
            ref={ref}
            type="checkbox"
            className={cx(styles.checkbox, className)}
          />
        )}
      </ChoiceField>
    );
  },
);
