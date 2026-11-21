import { describe, expect, it } from "vitest";
import { getInitials } from "./initials";

// Caso real: la primera celda de las tablas de personas muestra iniciales; nombres de una
// sola palabra, con espacios de más o vacíos no deben romperla.
describe("getInitials", () => {
  it("toma la primera y la última palabra", () => {
    expect(getInitials("María del Carmen Gómez")).toBe("MG");
  });

  it("con una sola palabra devuelve una inicial", () => {
    expect(getInitials("ana")).toBe("A");
  });

  it("ignora espacios sobrantes", () => {
    expect(getInitials("  Juan   Pérez  ")).toBe("JP");
  });

  it("con un nombre vacío devuelve un signo de pregunta", () => {
    expect(getInitials("   ")).toBe("?");
  });
});
