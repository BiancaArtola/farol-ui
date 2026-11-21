import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Modal, type ModalProps } from "./Modal";

const renderModal = (props: Partial<ModalProps> = {}) => {
  const onClose = vi.fn();
  render(
    <Modal open onClose={onClose} title="Eliminar emisor" {...props}>
      <button>Confirmar</button>
      <input aria-label="Motivo" />
    </Modal>,
  );
  return { onClose };
};

const Harness = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Abrir</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Detalle">
        <button>Dentro</button>
      </Modal>
    </>
  );
};

// Caso real: confirmar una baja o editar un emisor en un panel lateral. El diálogo tiene
// que anunciarse bien, cerrarse con Escape, no dejar escapar el foco y devolverlo al final.
describe("Modal", () => {
  it("cerrado no renderiza nada", () => {
    renderModal({ open: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("abierto es un diálogo modal con el título como nombre accesible", () => {
    renderModal();
    const dialog = screen.getByRole("dialog", { name: "Eliminar emisor" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("se renderiza fuera del contenedor, en el body", () => {
    renderModal();
    expect(screen.getByRole("dialog").closest("body")).toBe(document.body);
  });

  it("cierra con Escape", async () => {
    const { onClose } = renderModal();
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("cierra con el botón de cerrar y usa el texto accesible indicado", async () => {
    const { onClose } = renderModal({ closeLabel: "Cerrar" });
    await userEvent.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("cierra al hacer clic en el fondo, pero no al hacer clic adentro", () => {
    const { onClose } = renderModal();
    fireEvent.mouseDown(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseDown(
      screen.getByRole("dialog").parentElement as HTMLElement,
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("mueve el foco al primer elemento enfocable al abrir", () => {
    renderModal();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
  });

  it("Tab no escapa del diálogo: desde el último vuelve al primero", async () => {
    renderModal();
    screen.getByLabelText("Motivo").focus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
  });

  it("Shift+Tab desde el primero salta al último", async () => {
    renderModal();
    await userEvent.tab({ shift: true });
    expect(screen.getByLabelText("Motivo")).toHaveFocus();
  });

  it("bloquea el scroll del fondo mientras está abierto y lo restaura", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByText("Abrir"));
    expect(document.body.style.overflow).toBe("hidden");
    await userEvent.keyboard("{Escape}");
    expect(document.body.style.overflow).toBe("");
  });

  it("devuelve el foco a quien lo abrió al cerrar", async () => {
    render(<Harness />);
    const trigger = screen.getByText("Abrir");
    await userEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("muestra el pie con las acciones", () => {
    renderModal({ footer: <button>Cancelar</button> });
    expect(
      screen.getByRole("button", { name: "Cancelar" }),
    ).toBeInTheDocument();
  });

  it("como panel lateral usa la clase de su ubicación", () => {
    renderModal({ placement: "right" });
    expect(screen.getByRole("dialog")).toHaveClass("dialog-right");
  });
});
