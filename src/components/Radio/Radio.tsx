import { forwardRef, type InputHTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import { ChoiceField } from "../ChoiceField/ChoiceField";
import styles from "./RadioGroup.module.css";

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
  hint?: string;
  /** Oculta la etiqueta visualmente (por ejemplo en una celda de tabla) pero la conserva. */
  hideLabel?: boolean;
}

/**
 * Un radio suelto, para cuando las opciones del grupo no van juntas (por ejemplo una por
 * fila de una tabla). Los radios con el mismo `name` forman un grupo: las flechas los recorren.
 * Si las opciones van juntas, usar `RadioGroup`, que además agrupa con un `legend`.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, hint, hideLabel, id, className, ...rest },
  ref,
) {
  return (
    <ChoiceField label={label} hint={hint} hideLabel={hideLabel} id={id}>
      {(controlProps) => (
        <input
          {...rest}
          {...controlProps}
          ref={ref}
          type="radio"
          className={cx(styles.radio, className)}
        />
      )}
    </ChoiceField>
  );
});
