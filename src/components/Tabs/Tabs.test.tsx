import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tabs, type TabItem } from "./Tabs";

const items: TabItem[] = [
  { id: "resumen", label: "Resumen", content: "Contenido del resumen" },
  {
    id: "datos",
    label: "Datos",
    content: "Contenido de datos",
    disabled: true,
  },
  { id: "historial", label: "Historial", content: "Contenido del historial" },
];

const renderTabs = (props: Partial<Parameters<typeof Tabs>[0]> = {}) =>
  render(<Tabs label="Secciones" items={items} {...props} />);

// Caso real: las pantallas con pestañas tienen que poder usarse solo con teclado y ser
// legibles por un lector de pantalla (roles tablist, tab y tabpanel bien conectados).
describe("Tabs", () => {
  it("expone tablist, tabs y el panel activo con sus nombres", () => {
    renderTabs();
    expect(
      screen.getByRole("tablist", { name: "Secciones" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tabpanel", { name: "Resumen" })).toHaveTextContent(
      "Contenido del resumen",
    );
  });

  it("marca la primera pestaña habilitada como seleccionada por defecto", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: "Resumen" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Historial" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("respeta defaultTabId", () => {
    renderTabs({ defaultTabId: "historial" });
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "Contenido del historial",
    );
  });

  it("cambia de panel al hacer clic y avisa con onChange", async () => {
    const handleChange = vi.fn();
    renderTabs({ onChange: handleChange });
    await userEvent.click(screen.getByRole("tab", { name: "Historial" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "Contenido del historial",
    );
    expect(handleChange).toHaveBeenCalledWith("historial");
  });

  it("no permite elegir una pestaña deshabilitada", async () => {
    renderTabs();
    const disabledTab = screen.getByRole("tab", { name: "Datos" });
    expect(disabledTab).toBeDisabled();
    await userEvent.click(disabledTab);
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "Contenido del resumen",
    );
  });

  it("solo la pestaña activa entra en la secuencia de Tab", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: "Resumen" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("tab", { name: "Historial" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("las flechas mueven el foco y el panel, saltando la deshabilitada", async () => {
    renderTabs();
    await userEvent.tab();
    expect(screen.getByRole("tab", { name: "Resumen" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Historial" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "Contenido del historial",
    );
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Resumen" })).toHaveFocus();
  });

  it("Home y End van a los extremos", async () => {
    renderTabs({ defaultTabId: "resumen" });
    await userEvent.tab();
    await userEvent.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Historial" })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Resumen" })).toHaveFocus();
  });

  it("conecta cada pestaña con su panel (aria-controls / aria-labelledby)", () => {
    renderTabs();
    const tab = screen.getByRole("tab", { name: "Resumen" });
    const panel = screen.getByRole("tabpanel");
    expect(tab.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
  });

  it("sin pestañas habilitadas no rompe ni muestra panel", () => {
    render(
      <Tabs
        label="Vacío"
        items={[{ id: "a", label: "A", content: "x", disabled: true }]}
      />,
    );
    expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
  });
});

// Caso real: el encabezado de una app cambia de vista con pestañas; la vista actual también
// cambia desde otros lugares (un botón "Administrar") y las pantallas las dibuja la app.
describe("Tabs controladas y sin panel", () => {
  const vistas: TabItem[] = [
    { id: "facturar", label: <span>Facturar</span> },
    { id: "agenda", label: <span>Agenda</span> },
  ];

  it("usa activeTabId, avisa onChange sin cambiar por su cuenta y no dibuja panel", async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Tabs
        label="Secciones"
        items={vistas}
        activeTabId="facturar"
        onChange={onChange}
      />,
    );
    expect(screen.getByRole("tab", { name: "Facturar" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Agenda" })).not.toHaveAttribute(
      "aria-controls",
    );

    await userEvent.click(screen.getByRole("tab", { name: "Agenda" }));
    expect(onChange).toHaveBeenCalledWith("agenda");
    expect(screen.getByRole("tab", { name: "Agenda" })).toHaveAttribute(
      "aria-selected",
      "false",
    );

    rerender(<Tabs label="Secciones" items={vistas} activeTabId="agenda" />);
    expect(screen.getByRole("tab", { name: "Agenda" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
