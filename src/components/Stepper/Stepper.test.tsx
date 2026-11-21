import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stepper, type StepperStep } from "./Stepper";

const steps: StepperStep[] = [
  { id: "datos", label: "Datos" },
  { id: "pago", label: "Pago", description: "Tarjeta o transferencia" },
  { id: "confirmacion", label: "Confirmación" },
];

// Caso real: alta en tres pasos. Quien usa lector de pantalla tiene que saber en cuál
// está y cuáles terminó, no solo ver círculos de colores.
describe("Stepper", () => {
  it("es una lista con nombre accesible y un ítem por paso", () => {
    render(<Stepper steps={steps} currentStep={0} label="Alta de cuenta" />);
    expect(
      screen.getByRole("list", { name: "Alta de cuenta" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("marca solo el paso actual con aria-current", () => {
    render(<Stepper steps={steps} currentStep={1} label="Alta" />);
    const items = screen.getAllByRole("listitem");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[0]).not.toHaveAttribute("aria-current");
    expect(items[2]).not.toHaveAttribute("aria-current");
  });

  it("anuncia el estado de cada paso con texto", () => {
    render(<Stepper steps={steps} currentStep={1} label="Alta" />);
    expect(screen.getByText(", completado")).toBeInTheDocument();
    expect(screen.getByText(", paso actual")).toBeInTheDocument();
    expect(screen.getByText(", pendiente")).toBeInTheDocument();
  });

  it("muestra la descripción del paso si la tiene", () => {
    render(<Stepper steps={steps} currentStep={0} label="Alta" />);
    expect(screen.getByText("Tarjeta o transferencia")).toBeInTheDocument();
  });

  it("permite traducir los textos de estado", () => {
    render(
      <Stepper
        steps={steps}
        currentStep={0}
        label="Sign up"
        statusLabels={{
          complete: "done",
          current: "current step",
          upcoming: "todo",
        }}
      />,
    );
    expect(screen.getByText(", current step")).toBeInTheDocument();
  });
});
