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
  /** Oculta la etiqueta visualmente (por ejemplo en una celda de tabla) pero la conserva. */
  hideLabel?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, hint, hideLabel, id, className, ...rest }, ref) {
    return (
      <ChoiceField label={label} hint={hint} hideLabel={hideLabel} id={id}>
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
