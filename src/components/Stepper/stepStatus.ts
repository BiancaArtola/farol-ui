// Estado puro de cada paso de un Stepper según el paso actual.

export const STEP_STATUSES = ["complete", "current", "upcoming"] as const;
export type StepStatus = (typeof STEP_STATUSES)[number];

/** Los pasos anteriores al actual están completos; los posteriores, pendientes. */
export const getStepStatus = (
  stepIndex: number,
  currentStep: number,
): StepStatus => {
  if (stepIndex < currentStep) {
    return "complete";
  }
  return stepIndex === currentStep ? "current" : "upcoming";
};
