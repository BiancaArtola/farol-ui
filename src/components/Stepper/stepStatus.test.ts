import { describe, expect, it } from "vitest";
import { getStepStatus } from "./stepStatus";

// Caso real: un alta en tres pasos (datos, pago, confirmación); estando en el segundo,
// el primero figura completo y el tercero todavía no.
describe("getStepStatus", () => {
  it.each([
    [0, 1, "complete"],
    [1, 1, "current"],
    [2, 1, "upcoming"],
  ] as const)(
    "el paso %s con el actual en %s es %s",
    (index, current, status) => {
      expect(getStepStatus(index, current)).toBe(status);
    },
  );
});
