import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { useDismiss } from "./useDismiss";

const Harness = ({
  isOpen,
  onDismiss,
}: {
  isOpen: boolean;
  onDismiss: (reason: "escape" | "outside") => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useDismiss(isOpen, containerRef, onDismiss);
  return (
    <div>
      <div ref={containerRef}>
        <button>Dentro</button>
      </div>
      <button>Fuera</button>
    </div>
  );
};

// Caso real: un menú desplegable abierto. Escape lo cierra y devuelve el foco al botón;
// un clic en otra parte de la página también lo cierra, pero sin robar el foco.
describe("useDismiss", () => {
  it("avisa Escape como motivo", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Harness isOpen onDismiss={onDismiss} />);
    await user.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalledWith("escape");
  });

  it("avisa un clic fuera del contenedor", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Harness isOpen onDismiss={onDismiss} />);
    await user.click(screen.getByRole("button", { name: "Fuera" }));
    expect(onDismiss).toHaveBeenCalledWith("outside");
  });

  it("ignora un clic dentro del contenedor", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Harness isOpen onDismiss={onDismiss} />);
    await user.click(screen.getByRole("button", { name: "Dentro" }));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("no escucha nada mientras está cerrado", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Harness isOpen={false} onDismiss={onDismiss} />);
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Fuera" }));
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
