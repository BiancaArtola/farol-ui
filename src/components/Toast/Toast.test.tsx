import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast, type ShowToastOptions } from "./Toast";

const Trigger = ({ options }: { options: ShowToastOptions }) => {
  const { showToast } = useToast();
  return (
    <button type="button" onClick={() => showToast(options)}>
      avisar
    </button>
  );
};

const renderWithToast = (options: ShowToastOptions) =>
  render(
    <ToastProvider>
      <Trigger options={options} />
    </ToastProvider>,
  );

afterEach(() => vi.useRealTimers());

// Caso real: tras guardar o fallar una acción hay que avisar sin interrumpir el trabajo;
// los errores se anuncian de inmediato y los avisos se van solos.
describe("Toast", () => {
  it("muestra un aviso informativo como status", async () => {
    renderWithToast({ message: "Guardado" });
    await userEvent.click(screen.getByRole("button", { name: "avisar" }));
    expect(screen.getByRole("status")).toHaveTextContent("Guardado");
  });

  it("anuncia los errores como alerta", async () => {
    renderWithToast({ message: "No se pudo guardar", tone: "danger" });
    await userEvent.click(screen.getByRole("button", { name: "avisar" }));
    expect(screen.getByRole("alert")).toHaveTextContent("No se pudo guardar");
  });

  it("se cierra con su botón", async () => {
    renderWithToast({ message: "Guardado" });
    await userEvent.click(screen.getByRole("button", { name: "avisar" }));
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("se cierra solo al pasar la duración", () => {
    vi.useFakeTimers();
    renderWithToast({ message: "Guardado", duration: 1000 });
    act(() => screen.getByRole("button", { name: "avisar" }).click());
    expect(screen.getByRole("status")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("con duración 0 se queda hasta que se cierre a mano", () => {
    vi.useFakeTimers();
    renderWithToast({ message: "Importando", duration: 0 });
    act(() => screen.getByRole("button", { name: "avisar" }).click());
    act(() => vi.advanceTimersByTime(60000));
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("usar useToast fuera del proveedor da un error claro", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(<Trigger options={{ message: "x" }} />)).toThrow(
      /ToastProvider/,
    );
  });
});
