import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Navbar, type NavLinkItem } from "./Navbar";

const links: NavLinkItem[] = [
  { id: "inicio", label: "Inicio", href: "/", isCurrent: true },
  { id: "proyectos", label: "Proyectos", href: "/proyectos" },
];

// Caso real: el encabezado de un sitio. Los enlaces son una navegación con nombre, la
// página actual se anuncia, y en el celular el menú se abre desde un botón.
describe("Navbar", () => {
  it("muestra la marca y los enlaces dentro de una navegación", () => {
    render(<Navbar brand="Farol" links={links} />);
    expect(screen.getByText("Farol")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Principal" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Proyectos" })).toHaveAttribute(
      "href",
      "/proyectos",
    );
  });

  it("marca solo el enlace actual con aria-current", () => {
    render(<Navbar brand="Farol" links={links} />);
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Proyectos" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("muestra las acciones si se pasan", () => {
    render(
      <Navbar
        brand="Farol"
        links={links}
        actions={<button>Ingresar</button>}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Ingresar" }),
    ).toBeInTheDocument();
  });

  it("el botón de menú alterna aria-expanded", async () => {
    const user = userEvent.setup();
    render(<Navbar brand="Farol" links={links} />);
    const toggle = screen.getByRole("button", { name: "Menú" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("permite traducir el nombre de la navegación y del botón", () => {
    render(
      <Navbar brand="Farol" links={links} label="Main" menuLabel="Menu" />,
    );
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Menu" })).toBeInTheDocument();
  });
});
