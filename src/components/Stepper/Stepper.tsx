import type { HTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import { getStepStatus, type StepStatus } from "./stepStatus";
import styles from "./Stepper.module.css";

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
}

export type StepperStatusLabels = Record<StepStatus, string>;

const DEFAULT_STATUS_LABELS: StepperStatusLabels = {
  complete: "completado",
  current: "paso actual",
  upcoming: "pendiente",
};

export interface StepperProps extends Omit<
  HTMLAttributes<HTMLOListElement>,
  "children"
> {
  steps: StepperStep[];
  /** Posición (desde 0) del paso en curso. */
  currentStep: number;
  /** Nombre accesible de la lista de pasos. */
  label: string;
  /** Textos que anuncia el lector de pantalla para el estado de cada paso. */
  statusLabels?: StepperStatusLabels;
}

export const Stepper = ({
  steps,
  currentStep,
  label,
  statusLabels = DEFAULT_STATUS_LABELS,
  className,
  ...rest
}: StepperProps) => (
  <ol {...rest} aria-label={label} className={cx(styles.stepper, className)}>
    {steps.map((step, index) => {
      const status = getStepStatus(index, currentStep);
      return (
        <li
          key={step.id}
          aria-current={status === "current" ? "step" : undefined}
          className={cx(styles.step, styles[status])}
        >
          <span aria-hidden="true" className={styles.marker}>
            {status === "complete" ? "✓" : index + 1}
          </span>
          <span className={styles.text}>
            <span className={styles.label}>{step.label}</span>
            <span className={styles.hidden}>, {statusLabels[status]}</span>
            {step.description && (
              <span className={styles.description}>{step.description}</span>
            )}
          </span>
        </li>
      );
    })}
  </ol>
);
