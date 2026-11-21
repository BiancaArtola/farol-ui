import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Timeline, type TimelineItem } from "./Timeline";

const items: TimelineItem[] = [
  {
    id: "pedido",
    title: "Pedido recibido",
    time: "12 nov, 10:30",
    tone: "info",
  },
  {
    id: "envio",
    title: "Pedido enviado",
    description: "Salió del depósito.",
    tone: "success",
  },
  { id: "entrega", title: "Entrega pendiente" },
];

// Caso real: seguimiento de un pedido. La línea y los puntos son decoración; lo que se
// lee es una lista ordenada de eventos con su fecha.
describe("Timeline", () => {
  it("es una lista con nombre accesible y un ítem por evento", () => {
    render(<Timeline items={items} label="Seguimiento del pedido" />);
    expect(
      screen.getByRole("list", { name: "Seguimiento del pedido" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("muestra título, hora y descripción cuando existen", () => {
    render(<Timeline items={items} label="Seguimiento" />);
    expect(screen.getByText("12 nov, 10:30")).toBeInTheDocument();
    expect(screen.getByText("Salió del depósito.")).toBeInTheDocument();
  });

  it("aplica la clase del tono al marcador y no al evento sin tono", () => {
    const { container } = render(
      <Timeline items={items} label="Seguimiento" />,
    );
    const markers = container.querySelectorAll("[aria-hidden='true']");
    expect(markers[0]).toHaveClass("info");
    expect(markers[1]).toHaveClass("success");
    expect(markers[2]).toHaveClass("neutral");
  });
});
