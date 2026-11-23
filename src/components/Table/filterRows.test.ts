import { describe, expect, it } from "vitest";
import { filterRows, setColumnFilter } from "./filterRows";
import type { SortValue } from "./sortRows";

interface Invoice {
  client: string;
  status: string;
  total: number | null;
}

const getValue = (invoice: Invoice, key: string): SortValue =>
  key === "total"
    ? invoice.total
    : key === "status"
      ? invoice.status
      : invoice.client;

const invoices: Invoice[] = [
  { client: "José Álvarez", status: "Listo", total: 1200 },
  { client: "María Gómez", status: "Revisar", total: 350 },
  { client: "Jose Luna", status: "Revisar", total: null },
];

const clientsOf = (rows: Invoice[]) => rows.map((invoice) => invoice.client);

// Caso real: en el listado de comprobantes se escribe "jose" en Cliente y "revisar" en
// Estado para ver qué falta revisar de esa persona; los filtros se suman y no pueden
// distinguir tildes ni mayúsculas.
describe("filterRows", () => {
  it("sin filtros devuelve una copia de todas las filas", () => {
    const result = filterRows(invoices, {}, getValue);
    expect(result).toEqual(invoices);
    expect(result).not.toBe(invoices);
  });

  it("no distingue mayúsculas ni tildes", () => {
    expect(
      clientsOf(filterRows(invoices, { client: "JOSE" }, getValue)),
    ).toEqual(["José Álvarez", "Jose Luna"]);
  });

  it("combina los filtros de varias columnas con Y", () => {
    const result = filterRows(
      invoices,
      { client: "jose", status: "revisar" },
      getValue,
    );
    expect(clientsOf(result)).toEqual(["Jose Luna"]);
  });

  it("compara los números como texto", () => {
    expect(clientsOf(filterRows(invoices, { total: "120" }, getValue))).toEqual(
      ["José Álvarez"],
    );
  });

  it("un valor vacío no coincide con un filtro activo", () => {
    expect(clientsOf(filterRows(invoices, { total: "5" }, getValue))).toEqual([
      "María Gómez",
    ]);
  });

  it("ignora un filtro en blanco", () => {
    expect(filterRows(invoices, { client: "   " }, getValue)).toHaveLength(3);
  });
});

// Caso real: al borrar el texto de un filtro, la columna deja de contar como filtrada.
describe("setColumnFilter", () => {
  it("agrega y reemplaza el valor de una columna sin tocar las otras", () => {
    const first = setColumnFilter({ status: "listo" }, "client", "ana");
    expect(first).toEqual({ status: "listo", client: "ana" });
    expect(setColumnFilter(first, "client", "luis")).toEqual({
      status: "listo",
      client: "luis",
    });
  });

  it("quita la columna cuando el texto queda vacío", () => {
    expect(setColumnFilter({ client: "ana" }, "client", "")).toEqual({});
  });

  it("no modifica el objeto original", () => {
    const original = { client: "ana" };
    setColumnFilter(original, "client", "");
    expect(original).toEqual({ client: "ana" });
  });
});
