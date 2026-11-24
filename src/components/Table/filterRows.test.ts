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

// Caso real: filtrar los cobros de noviembre por la columna Fecha con un calendario; el valor del
// filtro es el rango como texto y las filas aportan su fecha (un `Date` o "AAAA-MM-DD").
describe("filterRows con rango de fechas", () => {
  const rows = [
    { id: "a", date: new Date(2026, 10, 3) },
    { id: "b", date: new Date(2026, 10, 20) },
    { id: "c", date: new Date(2026, 11, 2) },
    { id: "d", date: null as Date | null },
  ];
  const ids = (filters: Record<string, string>) =>
    filterRows(rows, filters, (row) => row.date).map((row) => row.id);

  it("deja las fechas dentro del rango, extremos incluidos, y descarta las filas sin fecha", () => {
    expect(ids({ date: "2026-11-03..2026-11-20" })).toEqual(["a", "b"]);
    expect(ids({ date: "2026-11-04..2026-12-02" })).toEqual(["b", "c"]);
  });

  it("un lado abierto no limita ese extremo", () => {
    expect(ids({ date: "2026-11-20.." })).toEqual(["b", "c"]);
    expect(ids({ date: "..2026-11-03" })).toEqual(["a"]);
  });

  it("también acepta filas con la fecha como texto ISO", () => {
    const texts = [{ date: "2026-11-05" }, { date: "05/11/2026" }];
    expect(
      filterRows(texts, { date: "2026-11-01..2026-11-30" }, (row) => row.date),
    ).toEqual([{ date: "2026-11-05" }]);
  });

  it("se combina con un filtro de texto de otra columna", () => {
    const people = [
      { name: "Ana", date: new Date(2026, 10, 3) },
      { name: "Beto", date: new Date(2026, 10, 4) },
    ];
    expect(
      filterRows(
        people,
        { date: "2026-11-01..2026-11-30", name: "be" },
        (row, key) => (key === "date" ? row.date : row.name),
      ),
    ).toEqual([people[1]]);
  });
});
