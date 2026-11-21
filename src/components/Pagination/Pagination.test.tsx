import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./Pagination";

// Caso real: un listado de 10 páginas de pedidos. Quien navega con teclado o lector de
// pantalla tiene que saber en qué página está y no poder retroceder desde la primera.
describe("Pagination", () => {
  it("marca la página actual con aria-current", () => {
    render(<Pagination page={5} pageCount={10} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Página 5" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("button", { name: "Página 4" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("avisa la página elegida al hacer clic en un número", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={5} pageCount={10} onPageChange={onPageChange} />);
    await user.click(screen.getByRole("button", { name: "Página 6" }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  it("anterior y siguiente mueven de a una página", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={5} pageCount={10} onPageChange={onPageChange} />);
    await user.click(screen.getByRole("button", { name: "Anterior" }));
    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(onPageChange).toHaveBeenNthCalledWith(1, 4);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 6);
  });

  it("deshabilita anterior en la primera y siguiente en la última", () => {
    const { rerender } = render(
      <Pagination page={1} pageCount={10} onPageChange={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
    rerender(<Pagination page={10} pageCount={10} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeDisabled();
  });

  it("no dibuja nada si hay una sola página", () => {
    const { container } = render(
      <Pagination page={1} pageCount={1} onPageChange={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("permite traducir los textos", () => {
    render(
      <Pagination
        page={2}
        pageCount={3}
        onPageChange={vi.fn()}
        label="Pages"
        previousLabel="Previous"
        nextLabel="Next"
        formatPageLabel={(page) => `Page ${page}`}
      />,
    );
    expect(
      screen.getByRole("navigation", { name: "Pages" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });
});
