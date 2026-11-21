import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
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
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = hint ? `${inputId}-hint` : undefined;

    return (
      <div className={styles.wrapper}>
        <input
          {...rest}
          ref={ref}
          id={inputId}
          type="checkbox"
          aria-describedby={hintId}
          className={cx(styles.checkbox, className)}
        />
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        {hint && (
          <p id={hintId} className={styles.hint}>
            {hint}
          </p>
        )}
      </div>
    );
  },
);
