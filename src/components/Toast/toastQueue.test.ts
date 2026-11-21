import { describe, expect, it } from "vitest";
import {
  addToast,
  getRemainingTime,
  removeToast,
  type ToastItem,
} from "./toastQueue";

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

// Caso real: alguien está leyendo un aviso de 5 s, pasa el mouse encima a los 4,5 s y lo
// suelta. Si se reanudara con 0,5 s, desaparecería al instante; tiene que quedar un margen.
describe("getRemainingTime", () => {
  it("descuenta el tiempo transcurrido", () => {
    expect(getRemainingTime(5000, 5000, 1000)).toBe(4000);
  });

  it("no baja del mínimo al reanudar", () => {
    expect(getRemainingTime(5000, 600, 500)).toBe(1000);
  });

  it("nunca supera la duración original (un aviso corto no se alarga)", () => {
    expect(getRemainingTime(400, 400, 300)).toBe(400);
  });
});
