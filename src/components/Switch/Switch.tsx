import { forwardRef, type InputHTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import { ChoiceField } from "../ChoiceField/ChoiceField";
import styles from "./Switch.module.css";

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "role"
> {
  label: string;
  hint?: string;
  /** Oculta la etiqueta visualmente (por ejemplo en una celda de tabla) pero la conserva. */
  hideLabel?: boolean;
}

// Es un checkbox nativo con role="switch": teclado, foco y formularios funcionan solos;
// el CSS solo cambia cómo se ve.
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, hint, hideLabel, id, className, ...rest },
  ref,
) {
  return (
    <ChoiceField
      label={label}
      hint={hint}
      hideLabel={hideLabel}
      id={id}
      className={styles.wrapper}
    >
      {(controlProps) => (
        <input
          {...rest}
          {...controlProps}
          ref={ref}
          type="checkbox"
          role="switch"
          className={cx(styles.switch, className)}
        />
      )}
    </ChoiceField>
  );
});
