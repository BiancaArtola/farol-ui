import { useId } from "react";
import { cx } from "../../utils/classNames";
import { ChoiceField } from "../ChoiceField/ChoiceField";
import styles from "./RadioGroup.module.css";

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Pregunta o título del grupo; es su nombre accesible. */
  legend: string;
  options: readonly RadioOption[];
  value: string;
  onChange: (value: string) => void;
  /** Nombre compartido de los radios; si no se pasa, se genera uno. */
  name?: string;
  hint?: string;
  className?: string;
}

// Los radios nativos ya se mueven con las flechas dentro de un mismo `name`; el fieldset
// con legend los agrupa para los lectores de pantalla.
export const RadioGroup = ({
  legend,
  options,
  value,
  onChange,
  name,
  hint,
  className,
}: RadioGroupProps) => {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const hintId = hint ? `${groupName}-hint` : undefined;

  return (
    <fieldset className={cx(styles.group, className)} aria-describedby={hintId}>
      <legend className={styles.legend}>{legend}</legend>
      {options.map((option) => (
        <ChoiceField
          key={option.value}
          label={option.label}
          id={`${groupName}-${option.value}`}
        >
          {(controlProps) => (
            <input
              id={controlProps.id}
              type="radio"
              name={groupName}
              value={option.value}
              checked={value === option.value}
              disabled={option.disabled}
              className={styles.radio}
              onChange={() => onChange(option.value)}
            />
          )}
        </ChoiceField>
      ))}
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
    </fieldset>
  );
};
