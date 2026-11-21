import { describe, expect, it } from "vitest";
import {
  formatFileSize,
  matchesAccept,
  validateFiles,
  type FileInfo,
} from "./fileValidation";

const file = (name: string, type: string, size = 1000): FileInfo => ({
  name,
  type,
  size,
});

// Caso real: un formulario de postulación que acepta CV en PDF o Word y fotos. Lo que no
// cumple se rechaza con su motivo, en vez de fallar recién al enviar.
describe("matchesAccept", () => {
  it("acepta todo si no hay criterio", () => {
    expect(matchesAccept(file("a.exe", "application/x-msdownload"))).toBe(true);
  });

  it("compara extensiones sin distinguir mayúsculas", () => {
    expect(matchesAccept(file("CV.PDF", ""), ".pdf")).toBe(true);
    expect(matchesAccept(file("cv.docx", ""), ".pdf")).toBe(false);
  });

  it("acepta una familia de tipos con comodín", () => {
    expect(matchesAccept(file("foto.png", "image/png"), "image/*")).toBe(true);
    expect(matchesAccept(file("a.pdf", "application/pdf"), "image/*")).toBe(
      false,
    );
  });

  it("acepta un tipo exacto y varios criterios a la vez", () => {
    expect(
      matchesAccept(file("a.pdf", "application/pdf"), ".doc, application/pdf"),
    ).toBe(true);
  });
});

describe("validateFiles", () => {
  it("rechaza por tipo y por tamaño, con el motivo", () => {
    const valid = file("cv.pdf", "application/pdf", 500);
    const wrongType = file("virus.exe", "application/x-msdownload", 500);
    const tooBig = file("grande.pdf", "application/pdf", 5000);
    const result = validateFiles([valid, wrongType, tooBig], {
      accept: ".pdf",
      maxSizeBytes: 1000,
    });
    expect(result.accepted).toEqual([valid]);
    expect(result.rejected).toEqual([
      { file: wrongType, reason: "type" },
      { file: tooBig, reason: "size" },
    ]);
  });

  it("sin límites acepta todos", () => {
    const result = validateFiles([file("a.txt", "text/plain", 10 ** 9)], {});
    expect(result.rejected).toEqual([]);
  });
});

describe("formatFileSize", () => {
  it.each([
    [512, "512 B"],
    [1536, "1,5 KB"],
    [2 * 1024 * 1024, "2,0 MB"],
    [3 * 1024 ** 3, "3,0 GB"],
  ])("%s bytes se muestran como %s", (bytes, expected) => {
    expect(formatFileSize(bytes)).toBe(expected);
  });
});
