import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button, ButtonLink, buttonClassName } from "./Button";

// Caso real: un botón dentro de un formulario sin type envía el form sin querer; y un
// botón "cargando" no debe poder dispararse dos veces.
describe("Button", () => {
  it("es type=button por defecto para no enviar formularios por accidente", () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByRole("button", { name: "Guardar" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("permite type=submit cuando se pide", () => {
    render(<Button type="submit">Enviar</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("dispara onClick", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Ir</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("no dispara onClick cuando está deshabilitado", async () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Ir
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("cargando: se bloquea y avisa aria-busy, sin disparar clicks", async () => {
    const handleClick = vi.fn();
    render(
      <Button isLoading onClick={handleClick}>
        Guardando
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Guardando" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("sin cargar no declara aria-busy", () => {
    render(<Button>Listo</Button>);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
  });

  it("reenvía el ref al botón nativo y respeta className", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} className="extra">
        Ref
      </Button>,
    );
    expect(ref.current).toBe(screen.getByRole("button"));
    expect(ref.current).toHaveClass("extra");
  });
});

// Caso real: "Descargar CV" y "Ver proyectos" son enlaces; tienen que verse como botones
// pero seguir siendo enlaces para teclado, lectores de pantalla y "abrir en pestaña nueva".
describe("ButtonLink", () => {
  it("es un enlace con el aspecto de un botón", () => {
    render(
      <ButtonLink href="/cv.pdf" download variant="secondary">
        Descargar CV
      </ButtonLink>,
    );
    const link = screen.getByRole("link", { name: "Descargar CV" });
    expect(link).toHaveAttribute("href", "/cv.pdf");
    expect(link).toHaveAttribute("download");
    expect(link.className).toMatch(/secondary/);
  });

  it("buttonClassName permite dar el estilo a un Link de otra librería", () => {
    expect(buttonClassName({ size: "lg", className: "extra" })).toMatch(
      /primary.*lg.*extra/,
    );
  });
});

// Caso real: una app que ajusta el tamaño de los íconos dentro de los botones necesita un
// selector que no dependa del nombre (con hash) de la clase generada.
describe("Button: gancho para estilos", () => {
  it('Button y ButtonLink llevan data-farol="button"', () => {
    render(
      <>
        <Button>Guardar</Button>
        <ButtonLink href="/x">Ir</ButtonLink>
      </>,
    );
    expect(screen.getByRole("button", { name: "Guardar" })).toHaveAttribute(
      "data-farol",
      "button",
    );
    expect(screen.getByRole("link", { name: "Ir" })).toHaveAttribute(
      "data-farol",
      "button",
    );
  });
});
