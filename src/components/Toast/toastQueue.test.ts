import { describe, expect, it } from "vitest";
import { addToast, removeToast, type ToastItem } from "./toastQueue";

const makeToast = (id: string): ToastItem => ({
  id,
  message: `Aviso ${id}`,
  tone: "info",
  duration: 5000,
});

// Caso real: importar 20 cobros dispara muchos avisos seguidos; la pantalla no puede
// llenarse, y cerrar uno no debe tocar a los demás.
describe("toastQueue", () => {
  it("agrega al final", () => {
    const toasts = addToast([makeToast("1")], makeToast("2"));
    expect(toasts.map((toast) => toast.id)).toEqual(["1", "2"]);
  });

  it("descarta los más viejos al pasar el máximo", () => {
    const toasts = ["1", "2", "3"].reduce(
      (current, id) => addToast(current, makeToast(id), 2),
      [] as ToastItem[],
    );
    expect(toasts.map((toast) => toast.id)).toEqual(["2", "3"]);
  });

  it("quita solo el aviso pedido", () => {
    const toasts = [makeToast("1"), makeToast("2")];
    expect(removeToast(toasts, "1").map((toast) => toast.id)).toEqual(["2"]);
    expect(removeToast(toasts, "inexistente")).toHaveLength(2);
  });
});
