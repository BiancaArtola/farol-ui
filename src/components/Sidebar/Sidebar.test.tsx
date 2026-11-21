import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sidebar, type SidebarSection } from "./Sidebar";

const sections: SidebarSection[] = [
  {
    id: "general",
    links: [{ id: "resumen", label: "Resumen", href: "/", isCurrent: true }],
  },
  {
    id: "cuenta",
    title: "Cuenta",
    links: [
      { id: "perfil", label: "Perfil", href: "/perfil" },
      { id: "pagos", label: "Pagos", href: "/pagos" },
    ],
  },
];

// Caso real: el panel de una app con un menú lateral dividido en grupos. Cada grupo con
// título se anuncia como lista con nombre, y la página actual se marca para lectores.
describe("Sidebar", () => {
  it("es una navegación con nombre accesible", () => {
    render(<Sidebar sections={sections} />);
    expect(
      screen.getByRole("navigation", { name: "Secciones" }),
    ).toBeInTheDocument();
  });

  it("renderiza un enlace por ítem con su destino", () => {
    render(<Sidebar sections={sections} />);
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Pagos" })).toHaveAttribute(
      "href",
      "/pagos",
    );
  });

  it("nombra la lista de cada grupo con su título", () => {
    render(<Sidebar sections={sections} />);
    expect(screen.getByRole("list", { name: "Cuenta" })).toBeInTheDocument();
  });

  it("marca solo el enlace actual", () => {
    render(<Sidebar sections={sections} />);
    expect(screen.getByRole("link", { name: "Resumen" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Perfil" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
