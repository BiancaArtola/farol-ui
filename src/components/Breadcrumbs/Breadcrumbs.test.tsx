import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumbs, type BreadcrumbItem } from "./Breadcrumbs";

const items: BreadcrumbItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Zapatillas" },
];

// Caso real: la ficha de un producto muestra de dónde viene el visitante. El último ítem
// es la página actual y no debe ser un enlace a sí misma.
describe("Breadcrumbs", () => {
  it("es una navegación con nombre accesible y una lista ordenada", () => {
    render(<Breadcrumbs items={items} />);
    expect(
      screen.getByRole("navigation", { name: "Ruta de navegación" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("enlaza los ítems intermedios", () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole("link", { name: "Productos" })).toHaveAttribute(
      "href",
      "/productos",
    );
  });

  it("marca el último como página actual y sin enlace", () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByText("Zapatillas")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.queryByRole("link", { name: "Zapatillas" }),
    ).not.toBeInTheDocument();
  });

  it("no enlaza el último aunque tenga href", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Aquí", href: "/x" },
        ]}
      />,
    );
    expect(
      screen.queryByRole("link", { name: "Aquí" }),
    ).not.toBeInTheDocument();
  });

  it("permite traducir el nombre de la navegación", () => {
    render(<Breadcrumbs items={items} label="Breadcrumb" />);
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toBeInTheDocument();
  });
});
