import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Combobox, type ComboboxOption } from "./Combobox";

const options: ComboboxOption[] = [
  { value: "cba", label: "Córdoba" },
  { value: "sl", label: "San Luis" },
  { value: "ba", label: "Buenos Aires", disabled: true },
  { value: "sc", label: "Santa Cruz" },
];

const Controlled = ({
  onChange,
  initial = null,
}: {
  onChange?: (value: string) => void;
  initial?: string | null;
}) => {
  const [value, setValue] = useState<string | null>(initial);
  return (
    <Combobox
      label="Provincia"
      options={options}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
};

// Caso real: un selector de provincias con búsqueda. Se escribe para filtrar, se navega con
// flechas y se elige con Enter; el lector de pantalla sigue la opción activa.
describe("Combobox", () => {
  it("es un combobox con su etiqueta y la lista cerrada", () => {
    render(<Controlled />);
    const input = screen.getByRole("combobox", { name: "Provincia" });
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("muestra el texto de la opción elegida", () => {
    render(<Controlled initial="sl" />);
    expect(screen.getByRole("combobox")).toHaveValue("San Luis");
  });

  it("al escribir filtra sin distinguir tildes y abre la lista", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    await user.type(screen.getByRole("combobox"), "cordoba");
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: "Córdoba" })).toBeInTheDocument();
  });

  it("las flechas mueven la opción activa saltando las deshabilitadas", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}");
    const first = screen.getByRole("option", { name: "Córdoba" });
    expect(input).toHaveAttribute("aria-activedescendant", first.id);
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: "Santa Cruz" }).id,
    );
  });

  it("Enter elige la opción activa y cierra la lista", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    await user.type(screen.getByRole("combobox"), "san");
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith("sl");
    expect(screen.getByRole("combobox")).toHaveValue("San Luis");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("un clic en una opción la elige", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{ArrowDown}");
    await user.click(screen.getByRole("option", { name: "Santa Cruz" }));
    expect(onChange).toHaveBeenCalledWith("sc");
  });

  it("no deja elegir una opción deshabilitada", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    await user.type(screen.getByRole("combobox"), "buenos");
    await user.click(screen.getByRole("option", { name: "Buenos Aires" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("pasar el mouse por una opción deshabilitada no la deja elegir con Enter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    await user.type(screen.getByRole("combobox"), "buenos");
    await user.hover(screen.getByRole("option", { name: "Buenos Aires" }));
    await user.keyboard("{Enter}");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("Escape cierra la lista y vuelve al texto de la opción elegida", async () => {
    const user = userEvent.setup();
    render(<Controlled initial="cba" />);
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{Control>}a{/Control}zzz");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveValue("Córdoba");
  });

  it("avisa cuando nada coincide", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    await user.type(screen.getByRole("combobox"), "zzz");
    expect(screen.getByRole("status")).toHaveTextContent("Sin resultados");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("al salir del campo cierra la lista", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    await user.type(screen.getByRole("combobox"), "san");
    await user.tab();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
