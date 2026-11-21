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

  // Caso real: "Listos" y "Revisar" filtran la tabla; la tarjeta del filtro puesto se
  // resalta y tiene que anunciarse como presionada a lectores de pantalla.
  it("con onClick anuncia si el filtro está puesto", () => {
    const { rerender } = render(
      <StatCard label="Listos" value={12} onClick={vi.fn()} />,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
    rerender(<StatCard label="Listos" value={12} onClick={vi.fn()} isActive />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("sin onClick no declara aria-pressed aunque isActive sea true", () => {
    const { container } = render(
      <StatCard label="Listos" value={12} isActive />,
    );
    expect(container.querySelector("[aria-pressed]")).toBeNull();
  });

  // Caso real: el ícono de "Listos" va en verde y el de "Excluidos" en gris, no todos azules.
  it("el ícono toma el color del tono", () => {
    render(
      <>
        <StatCard label="Listos" value={1} icon="✓" tone="success" />
        <StatCard label="Excluidos" value={2} icon="–" tone="neutral" />
      </>,
    );
    expect(screen.getByText("✓").className).toContain("success");
    expect(screen.getByText("–").className).toContain("neutral");
  });
});
