import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import type { DateRange } from "./dateRange";
import { DateRangePicker, type DateRangePickerProps } from "./DateRangePicker";

const TODAY = new Date(2026, 10, 24); // martes 24 de noviembre de 2026

// El componente es controlado: este envoltorio guarda el rango como lo haría una pantalla.
const Harness = ({
  initial = { from: null, to: null },
  onChange,
  ...props
}: {
  initial?: DateRange;
  onChange?: (range: DateRange) => void;
} & Partial<DateRangePickerProps>) => {
  const [range, setRange] = useState<DateRange>(initial);
  return (
    <DateRangePicker
      label="Fecha del cobro"
      today={TODAY}
      {...props}
      value={range}
      onChange={(next) => {
        setRange(next);
        onChange?.(next);
      }}
    />
  );
};

const day = (iso: string) => {
  const [year, month, dayOfMonth] = iso.split("-").map(Number);
  const name = new Intl.DateTimeFormat("es-AR", { dateStyle: "full" }).format(
    new Date(year!, month! - 1, dayOfMonth),
  );
  return screen.getByRole("button", { name });
};

// Caso real: filtrar los cobros de un período ("del 3 al 20 de noviembre") eligiendo las fechas en
// un calendario, sin escribirlas a mano en un campo de texto.
describe("DateRangePicker", () => {
  it("muestra el mes de hoy con la semana empezando en lunes", () => {
    render(<Harness />);
    expect(
      screen.getByRole("group", { name: "Fecha del cobro" }),
    ).toBeInTheDocument();
    expect(screen.getByText("noviembre de 2026")).toBeInTheDocument();
    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(7);
    expect(headers[0]).toHaveAttribute("abbr", "lunes");
    expect(headers[6]).toHaveAttribute("abbr", "domingo");
  });

  it("el primer clic fija el desde (hasta abierto) y el segundo completa el rango", async () => {
    const handleChange = vi.fn();
    render(<Harness onChange={handleChange} />);
    await userEvent.click(day("2026-11-03"));
    expect(handleChange).toHaveBeenLastCalledWith({
      from: "2026-11-03",
      to: null,
    });
    await userEvent.click(day("2026-11-20"));
    expect(handleChange).toHaveBeenLastCalledWith({
      from: "2026-11-03",
      to: "2026-11-20",
    });
    expect(day("2026-11-10")).toHaveAttribute("aria-pressed", "false");
    expect(day("2026-11-03")).toHaveAttribute("aria-pressed", "true");
    expect(day("2026-11-20")).toHaveAttribute("aria-pressed", "true");
  });

  it("si el segundo clic es anterior al primero, invierte los extremos", async () => {
    const handleChange = vi.fn();
    render(<Harness onChange={handleChange} />);
    await userEvent.click(day("2026-11-20"));
    await userEvent.click(day("2026-11-03"));
    expect(handleChange).toHaveBeenLastCalledWith({
      from: "2026-11-03",
      to: "2026-11-20",
    });
  });

  it("con un rango completo, un clic nuevo empieza otro", async () => {
    const handleChange = vi.fn();
    render(
      <Harness
        initial={{ from: "2026-11-03", to: "2026-11-20" }}
        onChange={handleChange}
      />,
    );
    await userEvent.click(day("2026-11-25"));
    expect(handleChange).toHaveBeenLastCalledWith({
      from: "2026-11-25",
      to: null,
    });
  });

  it("cambia de mes con los botones", async () => {
    render(<Harness />);
    await userEvent.click(
      screen.getByRole("button", { name: "Mes siguiente" }),
    );
    expect(screen.getByText("diciembre de 2026")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Mes anterior" }));
    await userEvent.click(screen.getByRole("button", { name: "Mes anterior" }));
    expect(screen.getByText("octubre de 2026")).toBeInTheDocument();
  });

  it("se recorre con las flechas y se elige con Enter", async () => {
    const handleChange = vi.fn();
    render(<Harness onChange={handleChange} />);
    day("2026-11-24").focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(day("2026-11-25")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(day("2026-12-02")).toHaveFocus(); // cruza al mes siguiente y lo muestra
    expect(screen.getByText("diciembre de 2026")).toBeInTheDocument();
    await userEvent.keyboard("{Enter}");
    expect(handleChange).toHaveBeenLastCalledWith({
      from: "2026-12-02",
      to: null,
    });
  });

  it("los atajos eligen un período de un clic", async () => {
    const handleChange = vi.fn();
    render(<Harness onChange={handleChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Este mes" }));
    expect(handleChange).toHaveBeenLastCalledWith({
      from: "2026-11-01",
      to: "2026-11-30",
    });
    await userEvent.click(screen.getByRole("button", { name: "Hoy" }));
    expect(handleChange).toHaveBeenLastCalledWith({
      from: "2026-11-24",
      to: "2026-11-24",
    });
  });

  it("sin atajos no los dibuja, y los textos se pueden cambiar", () => {
    render(
      <Harness
        presets={false}
        labels={{ clear: "Limpiar", nextMonth: "Próximo" }}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Este mes" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Limpiar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Próximo" })).toBeInTheDocument();
  });

  it("borrar las fechas solo está activo si hay un rango", async () => {
    const handleChange = vi.fn();
    render(<Harness onChange={handleChange} />);
    expect(
      screen.getByRole("button", { name: "Borrar fechas" }),
    ).toBeDisabled();
    await userEvent.click(day("2026-11-03"));
    await userEvent.click(
      screen.getByRole("button", { name: "Borrar fechas" }),
    );
    expect(handleChange).toHaveBeenLastCalledWith({ from: null, to: null });
  });
});
