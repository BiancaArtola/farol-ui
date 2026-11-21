import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Accordion, type AccordionItem } from "./Accordion";

const items: AccordionItem[] = [
  { id: "envios", title: "Envíos", content: "Llegan en 3 días." },
  { id: "pagos", title: "Pagos", content: "Se aceptan tarjetas." },
];

// Caso real: preguntas frecuentes de una tienda. El botón dice si la respuesta está
// abierta (aria-expanded) y la respuesta cerrada no debe estar disponible para nadie.
describe("Accordion", () => {
  it("empieza con todo cerrado y los paneles ocultos", () => {
    render(<Accordion items={items} />);
    expect(screen.getByRole("button", { name: "Envíos" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("abre las secciones indicadas por defecto", () => {
    render(<Accordion items={items} defaultOpenIds={["pagos"]} />);
    expect(screen.getByRole("region", { name: "Pagos" })).toHaveTextContent(
      "Se aceptan tarjetas.",
    );
  });

  it("abre y cierra una sección con el clic", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const trigger = screen.getByRole("button", { name: "Envíos" });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "Envíos" })).toBeVisible();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("cierra la anterior al abrir otra si no se admiten varias", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} defaultOpenIds={["envios"]} />);
    await user.click(screen.getByRole("button", { name: "Pagos" }));
    expect(screen.getByRole("button", { name: "Envíos" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("mantiene las otras abiertas con allowMultiple", async () => {
    const user = userEvent.setup();
    render(
      <Accordion items={items} defaultOpenIds={["envios"]} allowMultiple />,
    );
    await user.click(screen.getByRole("button", { name: "Pagos" }));
    expect(screen.getAllByRole("region")).toHaveLength(2);
  });

  it("usa el nivel de título indicado", () => {
    render(<Accordion items={items} headingLevel={4} />);
    expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(2);
  });
});
