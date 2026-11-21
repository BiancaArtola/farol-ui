import { describe, expect, it } from "vitest";
import { STATUS_TONES, getStatusRole } from "./tones";

// Caso real: un error al cargar un lote tiene que anunciarse en el momento, pero un
// aviso informativo no debe interrumpir a quien usa un lector de pantalla. Alert y Toast
// comparten esta regla; si divergen, el mismo aviso se oiría distinto según el componente.
describe("getStatusRole", () => {
  it.each(["warning", "danger"] as const)("%s interrumpe (alert)", (tone) => {
    expect(getStatusRole(tone)).toBe("alert");
  });

  it.each(["info", "success"] as const)("%s no interrumpe (status)", (tone) => {
    expect(getStatusRole(tone)).toBe("status");
  });

  it("define un rol para cada tono de la lista", () => {
    STATUS_TONES.forEach((tone) => {
      expect(["alert", "status"]).toContain(getStatusRole(tone));
    });
  });
});
