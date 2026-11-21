import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StatCard } from "./StatCard";

// Caso real: tarjetas de resumen del panel ("Listos: 12") que, si se pasa onClick, filtran
// la tabla; sin onClick son solo informativas y no deben ser enfocables.
describe("StatCard", () => {
  it("muestra etiqueta y valor", () => {
    render(<StatCard label="Listos" value={12} />);
    expect(screen.getByText("Listos")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("sin onClick no es un botón", () => {
    render(<StatCard label="Listos" value={12} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("con onClick es un botón que responde al clic y al teclado", async () => {
    const handleClick = vi.fn();
    render(<StatCard label="Listos" value={12} onClick={handleClick} />);
    await userEvent.click(screen.getByRole("button", { name: /Listos/ }));
    await userEvent.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
