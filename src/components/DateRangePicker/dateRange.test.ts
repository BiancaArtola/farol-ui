import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  buildMonthGrid,
  isInRange,
  keyboardTarget,
  normalizeRange,
  parseDateRange,
  parseIsoDate,
  presetRanges,
  serializeDateRange,
  toIsoDate,
} from "./dateRange";

// Caso real: filtrar cobros de un período ("todo noviembre"). Las fechas viajan como texto
// "AAAA-MM-DD" para que ninguna zona horaria corra un día y el rango se pueda guardar y comparar.
describe("fechas ISO", () => {
  it("convierte de ida y vuelta sin correr el día", () => {
    expect(toIsoDate(new Date(2026, 10, 5))).toBe("2026-11-05");
    expect(toIsoDate(parseIsoDate("2026-02-28")!)).toBe("2026-02-28");
  });

  it("rechaza fechas que no existen o están mal escritas", () => {
    expect(parseIsoDate("2026-02-31")).toBeNull();
    expect(parseIsoDate("2026-13-01")).toBeNull();
    expect(parseIsoDate("05/11/2026")).toBeNull();
    expect(parseIsoDate("")).toBeNull();
  });
});

// Caso real: el rango elegido en el calendario se guarda como texto en el filtro de una columna.
describe("rangos", () => {
  it("ordena los extremos si vienen al revés", () => {
    expect(normalizeRange({ from: "2026-11-30", to: "2026-11-01" })).toEqual({
      from: "2026-11-01",
      to: "2026-11-30",
    });
  });

  it("incluye los extremos y un lado abierto no limita", () => {
    const range = { from: "2026-11-01", to: "2026-11-30" };
    expect(isInRange("2026-11-01", range)).toBe(true);
    expect(isInRange("2026-11-30", range)).toBe(true);
    expect(isInRange("2026-12-01", range)).toBe(false);
    expect(isInRange("2026-10-31", range)).toBe(false);
    expect(isInRange("2030-01-01", { from: "2026-11-01", to: null })).toBe(
      true,
    );
    expect(isInRange("2020-01-01", { from: null, to: "2026-11-01" })).toBe(
      true,
    );
  });

  it("se guarda como texto y se lee igual, incluso con un lado abierto", () => {
    const range = { from: "2026-11-01", to: "2026-11-30" };
    expect(serializeDateRange(range)).toBe("2026-11-01..2026-11-30");
    expect(parseDateRange("2026-11-01..2026-11-30")).toEqual(range);
    expect(parseDateRange("2026-11-01..")).toEqual({
      from: "2026-11-01",
      to: null,
    });
    expect(parseDateRange("..2026-11-30")).toEqual({
      from: null,
      to: "2026-11-30",
    });
    expect(serializeDateRange({ from: null, to: null })).toBe("");
  });

  it("no confunde un texto cualquiera con un rango", () => {
    expect(parseDateRange("maria")).toBeNull();
    expect(parseDateRange("..")).toBeNull();
    expect(parseDateRange("2026-02-31..2026-03-01")).toBeNull();
    expect(parseDateRange("")).toBeNull();
  });
});

// Caso real: el calendario muestra la semana desde el lunes y no cambia de alto entre meses.
describe("grilla del mes", () => {
  it("siempre tiene 6 semanas de 7 días, empezando en lunes", () => {
    const grid = buildMonthGrid(2026, 10); // noviembre de 2026: el 1.º es domingo
    expect(grid).toHaveLength(6);
    for (const week of grid) {
      expect(week).toHaveLength(7);
    }
    expect(toIsoDate(grid[0]![0]!)).toBe("2026-10-26"); // lunes anterior
    expect(toIsoDate(grid[0]![6]!)).toBe("2026-11-01");
    expect(toIsoDate(grid[5]![6]!)).toBe("2026-12-06");
  });

  it("con la semana en domingo el mes del 1.º de domingo empieza ese mismo día", () => {
    expect(toIsoDate(buildMonthGrid(2026, 10, 0)[0]![0]!)).toBe("2026-11-01");
  });
});

// Caso real: pasar de mes parado en el día 31 no puede saltear febrero.
describe("mover fechas", () => {
  it("suma días cruzando el mes", () => {
    expect(toIsoDate(addDays(new Date(2026, 10, 30), 1))).toBe("2026-12-01");
    expect(toIsoDate(addDays(new Date(2026, 10, 1), -1))).toBe("2026-10-31");
  });

  it("suma meses sin pasarse: el 31 de enero más un mes es fin de febrero", () => {
    expect(toIsoDate(addMonths(new Date(2026, 0, 31), 1))).toBe("2026-02-28");
    expect(toIsoDate(addMonths(new Date(2026, 11, 15), 1))).toBe("2027-01-15");
    expect(toIsoDate(addMonths(new Date(2026, 0, 15), -1))).toBe("2025-12-15");
  });
});

// Caso real: quien usa el calendario sin mouse tiene que poder llegar a cualquier fecha.
describe("teclado", () => {
  const wednesday = new Date(2026, 10, 18);
  const targetIso = (key: string, weekStart?: number) => {
    const date = keyboardTarget(key, wednesday, weekStart);
    return date && toIsoDate(date);
  };

  it("las flechas mueven por día y semana, y Re Pág / Av Pág por mes", () => {
    expect(targetIso("ArrowLeft")).toBe("2026-11-17");
    expect(targetIso("ArrowDown")).toBe("2026-11-25");
    expect(targetIso("ArrowUp")).toBe("2026-11-11");
    expect(targetIso("PageDown")).toBe("2026-12-18");
    expect(targetIso("PageUp")).toBe("2026-10-18");
  });

  it("Inicio y Fin van a los bordes de la semana según con qué día empieza", () => {
    expect(targetIso("Home")).toBe("2026-11-16");
    expect(targetIso("End")).toBe("2026-11-22");
    expect(targetIso("Home", 0)).toBe("2026-11-15");
    expect(targetIso("End", 0)).toBe("2026-11-21");
  });

  it("otras teclas no mueven el foco", () => {
    expect(targetIso("Enter")).toBeNull();
  });
});

// Caso real: elegir "este mes" o "el mes pasado" sin recorrer el calendario.
describe("atajos", () => {
  const today = new Date(2026, 10, 24);

  it("calcula hoy, los últimos 7 días y este mes", () => {
    const presets = presetRanges(today);
    expect(presets.today).toEqual({ from: "2026-11-24", to: "2026-11-24" });
    expect(presets.last7Days).toEqual({ from: "2026-11-18", to: "2026-11-24" });
    expect(presets.thisMonth).toEqual({ from: "2026-11-01", to: "2026-11-30" });
  });

  it("el mes anterior de enero es diciembre del año anterior", () => {
    expect(presetRanges(new Date(2026, 0, 10)).previousMonth).toEqual({
      from: "2025-12-01",
      to: "2025-12-31",
    });
  });
});
