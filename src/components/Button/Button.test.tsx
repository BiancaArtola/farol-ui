import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

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
