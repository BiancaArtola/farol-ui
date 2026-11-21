import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoadMore } from "./LoadMore";

// Caso real: una tabla con 250 filas muestra de a 100; el cierre dice cuántas se ven y
// permite cargar más, y desaparece cuando ya se ven todas.
describe("LoadMore", () => {
  it("muestra el contador y el botón", () => {
    render(<LoadMore visible={100} total={250} onLoadMore={() => undefined} />);
    expect(screen.getByText("Showing 100 of 250")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show more" }),
    ).toBeInTheDocument();
  });

  it("avisa al hacer clic", async () => {
    const handleLoadMore = vi.fn();
    render(<LoadMore visible={100} total={250} onLoadMore={handleLoadMore} />);
    await userEvent.click(screen.getByRole("button"));
    expect(handleLoadMore).toHaveBeenCalledOnce();
  });

  it("no dibuja nada cuando ya se ve todo", () => {
    const { container } = render(
      <LoadMore visible={250} total={250} onLoadMore={() => undefined} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("permite traducir el texto", () => {
    render(
      <LoadMore
        visible={100}
        total={250}
        onLoadMore={() => undefined}
        buttonLabel="Mostrar más"
        formatSummary={(visible, total) => `Mostrando ${visible} de ${total}`}
      />,
    );
    expect(screen.getByText("Mostrando 100 de 250")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mostrar más" }),
    ).toBeInTheDocument();
  });
});
