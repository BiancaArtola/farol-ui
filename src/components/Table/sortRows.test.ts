import { describe, expect, it } from "vitest";
import { nextSort, sortRows, type SortValue } from "./sortRows";

interface Person {
  name: string;
  amount: number | null;
}

const getValue = (person: Person, key: string): SortValue =>
  key === "name" ? person.name : person.amount;

const people: Person[] = [
  { name: "Zoe", amount: 30 },
  { name: "Álvaro", amount: null },
  { name: "ana", amount: 5 },
  { name: "Bruno", amount: 100 },
];

const namesOf = (rows: Person[]) => rows.map((person) => person.name);

// Caso real: la tabla de comprobantes se ordena por importe y por nombre; hay filas sin
// importe y nombres con acento o minúscula que no deben quedar fuera de lugar.
describe("sortRows", () => {
  it("ordena texto sin distinguir acentos ni mayúsculas", () => {
    const sorted = sortRows(
      people,
      { key: "name", direction: "asc" },
      getValue,
    );
    expect(namesOf(sorted)).toEqual(["Álvaro", "ana", "Bruno", "Zoe"]);
  });

  it("ordena números por valor y no como texto (5 antes que 30 y 100)", () => {
    const sorted = sortRows(
      people,
      { key: "amount", direction: "asc" },
      getValue,
    );
    expect(namesOf(sorted)).toEqual(["ana", "Zoe", "Bruno", "Álvaro"]);
  });

  it("deja los vacíos al final también en orden descendente", () => {
    const sorted = sortRows(
      people,
      { key: "amount", direction: "desc" },
      getValue,
    );
    expect(namesOf(sorted)).toEqual(["Bruno", "Zoe", "ana", "Álvaro"]);
  });

  it("sin orden devuelve una copia en el orden original", () => {
    const sorted = sortRows(people, null, getValue);
    expect(sorted).toEqual(people);
    expect(sorted).not.toBe(people);
  });
});

// Caso real: el usuario clica la misma cabecera para ir y volver al orden original.
describe("nextSort", () => {
  it("avanza asc, desc y vuelve a sin orden", () => {
    const first = nextSort(null, "name");
    expect(first).toEqual({ key: "name", direction: "asc" });
    const second = nextSort(first, "name");
    expect(second).toEqual({ key: "name", direction: "desc" });
    expect(nextSort(second, "name")).toBeNull();
  });

  it("al cambiar de columna empieza en ascendente", () => {
    expect(nextSort({ key: "name", direction: "desc" }, "amount")).toEqual({
      key: "amount",
      direction: "asc",
    });
  });
});
