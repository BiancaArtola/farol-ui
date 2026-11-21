import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

// Caso real: el estado de una fila (Listo, Revisar, Error) se muestra con un badge; el
// texto es lo que lee un lector de pantalla, el color es solo refuerzo visual.
describe("Badge", () => {
  it("muestra su contenido como texto", () => {
    render(<Badge tone="success">Listo</Badge>);
    expect(screen.getByText("Listo")).toBeInTheDocument();
  });

  it("usa el tono neutral por defecto", () => {
    render(<Badge>Borrador</Badge>);
    expect(screen.getByText("Borrador")).toHaveClass("neutral");
  });

  it.each(["info", "success", "warning", "danger"] as const)(
    "aplica la clase del tono %s",
    (tone) => {
      render(<Badge tone={tone}>Estado</Badge>);
      expect(screen.getByText("Estado")).toHaveClass(tone);
    },
  );

  it("combina className y reenvía atributos HTML", () => {
    render(
      <Badge className="extra" data-testid="badge" title="Detalle">
        Con extras
      </Badge>,
    );
    const badge = screen.getByTestId("badge");
    expect(badge).toHaveClass("extra");
    expect(badge).toHaveAttribute("title", "Detalle");
  });
});
