import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FileUpload } from "./FileUpload";

const pdf = (name = "cv.pdf", size = 2048) =>
  new File([new Uint8Array(size)], name, { type: "application/pdf" });

// Caso real: un formulario de postulación donde se adjunta el CV. Se elige con el
// selector (teclado incluido) o arrastrando, y lo que no cumple se explica con un mensaje.
describe("FileUpload", () => {
  it("el control es un campo de archivo con su etiqueta", () => {
    render(<FileUpload label="Currículum" accept=".pdf" />);
    expect(screen.getByLabelText("Currículum")).toHaveAttribute("type", "file");
    expect(screen.getByLabelText("Currículum")).toHaveAttribute(
      "accept",
      ".pdf",
    );
  });

  it("lista el archivo elegido con su tamaño y avisa onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FileUpload label="Currículum" onChange={onChange} />);
    await user.upload(screen.getByLabelText("Currículum"), pdf("cv.pdf", 2048));
    expect(screen.getByText("cv.pdf")).toBeInTheDocument();
    expect(screen.getByText("2,0 KB")).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ name: "cv.pdf" }),
    ]);
  });

  it("quita un archivo con su botón accesible", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FileUpload label="Currículum" onChange={onChange} />);
    await user.upload(screen.getByLabelText("Currículum"), pdf());
    await user.click(screen.getByRole("button", { name: "Quitar cv.pdf" }));
    expect(screen.queryByText("cv.pdf")).not.toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("sin multiple, un archivo nuevo reemplaza al anterior", async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Currículum" />);
    await user.upload(screen.getByLabelText("Currículum"), pdf("uno.pdf"));
    await user.upload(screen.getByLabelText("Currículum"), pdf("dos.pdf"));
    expect(screen.queryByText("uno.pdf")).not.toBeInTheDocument();
    expect(screen.getByText("dos.pdf")).toBeInTheDocument();
  });

  it("con multiple, acumula los archivos", async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Adjuntos" multiple />);
    await user.upload(screen.getByLabelText("Adjuntos"), pdf("uno.pdf"));
    await user.upload(screen.getByLabelText("Adjuntos"), pdf("dos.pdf"));
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("rechaza un archivo demasiado grande y lo explica", async () => {
    const user = userEvent.setup();
    const onReject = vi.fn();
    render(
      <FileUpload label="Currículum" maxSizeBytes={1000} onReject={onReject} />,
    );
    await user.upload(
      screen.getByLabelText("Currículum"),
      pdf("grande.pdf", 5000),
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "grande.pdf: supera el tamaño máximo",
    );
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(onReject).toHaveBeenCalledTimes(1);
  });

  it("acepta archivos arrastrados a la zona", () => {
    const onChange = vi.fn();
    render(<FileUpload label="Currículum" onChange={onChange} />);
    const zone = screen.getByText("o arrastrar los archivos hasta acá")
      .parentElement as HTMLElement;
    fireEvent.drop(zone, { dataTransfer: { files: [pdf("arrastrado.pdf")] } });
    expect(screen.getByText("arrastrado.pdf")).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("no acepta archivos arrastrados si está deshabilitado", () => {
    render(<FileUpload label="Currículum" disabled />);
    const zone = screen.getByText("o arrastrar los archivos hasta acá")
      .parentElement as HTMLElement;
    fireEvent.drop(zone, { dataTransfer: { files: [pdf()] } });
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("muestra el error que viene de afuera antes que el propio", () => {
    render(<FileUpload label="Currículum" error="Falta adjuntar el CV" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Falta adjuntar el CV");
  });
});
