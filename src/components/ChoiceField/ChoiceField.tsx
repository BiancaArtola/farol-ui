import { useId, type ReactNode } from "react";
import { cx } from "../../utils/classNames";
import styles from "./ChoiceField.module.css";

interface ChoiceControlProps {
  id: string;
  "aria-describedby"?: string;
}

interface ChoiceFieldProps {
  label: string;
  hint?: string;
  id?: string;
  className?: string;
  /** Recibe el id y el aria-describedby que el control (input) debe llevar. */
  children: (controlProps: ChoiceControlProps) => ReactNode;
}

/**
 * Envuelve un control de elección (Checkbox, Switch, un radio) con su etiqueta y ayuda,
 * y los conecta con id y aria-describedby. Es interno: evita repetir esto en cada uno.
 */
export const ChoiceField = ({
  label,
  hint,
  id: idProp,
  className,
  children,
}: ChoiceFieldProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className={cx(styles.wrapper, className)}>
      {children({ id, "aria-describedby": hintId })}
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  );
};
