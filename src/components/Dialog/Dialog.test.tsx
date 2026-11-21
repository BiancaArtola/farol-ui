import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DialogProvider, useDialog } from "./Dialog";

interface HarnessProps {
  onResult: (result: boolean | string | null) => void;
}

const Harness = ({ onResult }: HarnessProps) => {
  const { confirm, prompt } = useDialog();
  return (
    <>
      <button
        onClick={async () =>
          onResult(
            await confirm({ message: "¿Borrar el emisor?", isDanger: true }),
          )
        }
      >
        Borrar
      </button>
      <button
        onClick={async () =>
          onResult(
            await prompt({
              message: "Nombre del banco",
              initialValue: "Santa",
            }),
          )
        }
      >
        Pedir nombre
      </button>
    </>
  );
};

const renderHarness = () => {
  const onResult = vi.fn();
  render(
    <DialogProvider>
      <Harness onResult={onResult} />
    </DialogProvider>,
  );
  return { onResult };
};

// Caso real: borrar un emisor o nombrar un banco nuevo reemplaza al confirm()/prompt()
// nativo; el código que llama espera una promesa que resuelva una sola vez.
describe("DialogProvider", () => {
  it("confirmar resuelve true al aceptar", async () => {
    const { onResult } = renderHarness();
    await userEvent.click(screen.getByRole("button", { name: "Borrar" }));
    expect(screen.getByRole("dialog", { name: "Confirm" })).toBeInTheDocument();
    expect(screen.getByText("¿Borrar el emisor?")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onResult).toHaveBeenCalledExactlyOnceWith(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("confirmar resuelve false con Cancelar y con Escape", async () => {
    const { onResult } = renderHarness();
    await userEvent.click(screen.getByRole("button", { name: "Borrar" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await userEvent.click(screen.getByRole("button", { name: "Borrar" }));
    await userEvent.keyboard("{Escape}");
    expect(onResult).toHaveBeenNthCalledWith(1, false);
    expect(onResult).toHaveBeenNthCalledWith(2, false);
  });

  it("pedir texto resuelve el valor editado, y acepta con Enter", async () => {
    const { onResult } = renderHarness();
    await userEvent.click(screen.getByRole("button", { name: "Pedir nombre" }));
    const input = screen.getByLabelText("Nombre del banco");
    expect(input).toHaveValue("Santa");
    await userEvent.type(input, " Fe{Enter}");
    expect(onResult).toHaveBeenCalledExactlyOnceWith("Santa Fe");
  });

  it("pedir texto resuelve null al cancelar", async () => {
    const { onResult } = renderHarness();
    await userEvent.click(screen.getByRole("button", { name: "Pedir nombre" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onResult).toHaveBeenCalledExactlyOnceWith(null);
  });

  it("los textos se pueden traducir", async () => {
    render(
      <DialogProvider
        labels={{ cancel: "Cancelar", confirmTitle: "Confirmar" }}
      >
        <Harness onResult={vi.fn()} />
      </DialogProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Borrar" }));
    expect(
      screen.getByRole("dialog", { name: "Confirmar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancelar" }),
    ).toBeInTheDocument();
  });

  it("sin provider se comporta como cancelar y no se cuelga", async () => {
    const onResult = vi.fn();
    render(<Harness onResult={onResult} />);
    await userEvent.click(screen.getByRole("button", { name: "Borrar" }));
    expect(onResult).toHaveBeenCalledExactlyOnceWith(false);
  });
});
