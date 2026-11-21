import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

// Caso real: una tarjeta vive dentro de una página con su propia jerarquía de títulos;
// si el nivel del encabezado fuera fijo, se romperían los niveles (h1 > h2 > h3).
describe("Card", () => {
  it("muestra título, contenido y pie", () => {
    render(
      <Card title="Resumen" footer={<button>Ver más</button>}>
        Contenido de la tarjeta
      </Card>,
    );
    expect(
      screen.getByRole("heading", { name: "Resumen" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Contenido de la tarjeta")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver más" })).toBeInTheDocument();
  });

  it("usa h3 por defecto y permite elegir otro nivel", () => {
    const { rerender } = render(<Card title="Título">x</Card>);
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
    rerender(
      <Card title="Título" headingLevel={2}>
        x
      </Card>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("sin título no deja un encabezado vacío", () => {
    render(<Card>Solo contenido</Card>);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("es un article y reenvía atributos", () => {
    render(
      <Card aria-label="Tarjeta de prueba" className="extra">
        x
      </Card>,
    );
    const card = screen.getByRole("article", { name: "Tarjeta de prueba" });
    expect(card).toHaveClass("extra");
  });
});
