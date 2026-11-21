import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert } from "./Alert";

// Caso real: un error al cargar un lote tiene que anunciarse en el momento, pero un aviso
// informativo no debe interrumpir a quien usa un lector de pantalla.
describe("Alert", () => {
  it("anuncia advertencias y errores como alerta", () => {
    render(<Alert tone="danger">No se pudo cargar el lote</Alert>);
    expect(screen.getByRole("alert")).toHaveTextContent("No se pudo cargar");
  });

  it("los avisos informativos usan status, sin interrumpir", () => {
    render(<Alert>Se guarda solo</Alert>);
    expect(screen.getByRole("status")).toHaveTextContent("Se guarda solo");
  });

  it("muestra el título cuando se pasa", () => {
    render(<Alert title="Atención">Revisar los datos</Alert>);
    expect(screen.getByText("Atención")).toBeInTheDocument();
  });
});
