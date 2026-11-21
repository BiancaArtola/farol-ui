import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import { Field } from "../Field/Field";
import { splitFieldProps, type FieldOwnProps } from "../Field/fieldProps";
import styles from "./Slider.module.css";

export interface SliderProps
  extends
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "type" | "value" | "defaultValue"
    >,
    FieldOwnProps {
  min?: number;
  max?: number;
  step?: number;
  /** Valor controlado; sin él, el slider maneja su propio valor. */
  value?: number;
  defaultValue?: number;
  /** Muestra el valor actual junto a la etiqueta. */
  showValue?: boolean;
  /** Cómo se escribe el valor (por ejemplo `(value) => `${value} %``). */
  formatValue?: (value: number) => string;
}

/** Control deslizante para elegir un número dentro de un rango (volumen, precio máximo). */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  function Slider(props, ref) {
    const { fieldProps, controlProps } = splitFieldProps(props);
    const {
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue = min,
      showValue = true,
      formatValue = String,
      onChange,
      className,
      ...rest
    } = controlProps;
    const [innerValue, setInnerValue] = useState(defaultValue);
    const currentValue = value ?? innerValue;

    return (
      <Field {...fieldProps}>
        {(accessibilityProps) => (
          <div className={styles.row}>
            <input
              {...rest}
              {...accessibilityProps}
              ref={ref}
              type="range"
              min={min}
              max={max}
              step={step}
              value={currentValue}
              className={cx(styles.slider, className)}
              onChange={(event) => {
                setInnerValue(Number(event.target.value));
                onChange?.(event);
              }}
            />
            {showValue && (
              <output htmlFor={accessibilityProps.id} className={styles.value}>
                {formatValue(currentValue)}
              </output>
            )}
          </div>
        )}
      </Field>
    );
  },
);
