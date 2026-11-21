import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Slider } from "./Slider";

// Caso real: un filtro de "precio máximo". El valor se ve al lado, se mueve con flechas y
// el campo conserva su etiqueta y su ayuda para lectores de pantalla.
describe("Slider", () => {
  it("es un control deslizante con su etiqueta y rango", () => {
    render(<Slider label="Precio máximo" min={10} max={50} step={5} />);
    const slider = screen.getByRole("slider", { name: "Precio máximo" });
    expect(slider).toHaveAttribute("min", "10");
    expect(slider).toHaveAttribute("max", "50");
    expect(slider).toHaveAttribute("step", "5");
  });

  it("empieza en el valor por defecto y lo muestra", () => {
    render(<Slider label="Volumen" defaultValue={30} />);
    expect(screen.getByRole("slider")).toHaveValue("30");
    expect(screen.getByRole("status")).toHaveTextContent("30");
  });

  // jsdom no implementa las flechas sobre un range (lo hace el navegador), así que se
  // simula el cambio que el navegador dispara.
  it("cambia el valor y avisa onChange", () => {
    const onChange = vi.fn();
    render(<Slider label="Volumen" defaultValue={30} onChange={onChange} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "31" } });
    expect(screen.getByRole("slider")).toHaveValue("31");
    expect(screen.getByRole("status")).toHaveTextContent("31");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("sigue el valor controlado", () => {
    const { rerender } = render(
      <Slider label="Volumen" value={20} onChange={() => undefined} />,
    );
    expect(screen.getByRole("slider")).toHaveValue("20");
    rerender(<Slider label="Volumen" value={70} onChange={() => undefined} />);
    expect(screen.getByRole("status")).toHaveTextContent("70");
  });

  it("formatea el valor mostrado y puede ocultarlo", () => {
    const { rerender } = render(
      <Slider
        label="Descuento"
        defaultValue={15}
        formatValue={(value) => `${value} %`}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("15 %");
    rerender(<Slider label="Descuento" defaultValue={15} showValue={false} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("conecta la ayuda y el error con el control", () => {
    render(<Slider label="Volumen" hint="De 0 a 100" error="Demasiado alto" />);
    expect(screen.getByRole("slider")).toHaveAccessibleDescription(
      "De 0 a 100 Demasiado alto",
    );
    expect(screen.getByRole("slider")).toHaveAttribute("aria-invalid", "true");
  });
});
