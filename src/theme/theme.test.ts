import { afterEach, describe, expect, it } from "vitest";
import {
  DEFAULT_THEME_STORAGE_KEY,
  getThemeInitScript,
  isThemePreference,
  parsePreference,
  resolveTheme,
} from "./theme";

// Caso real: localStorage puede traer cualquier cosa (otra versión, un valor editado a
// mano). Un valor raro no debe romper el tema ni dejarlo en un estado inválido.
describe("parsePreference", () => {
  it.each(["light", "dark", "system"] as const)("acepta %s", (value) => {
    expect(parsePreference(value)).toBe(value);
  });

  it.each([null, "", "azul", "DARK"])("usa system para %j", (value) => {
    expect(parsePreference(value)).toBe("system");
  });
});

// Un valor viejo o manipulado en localStorage no debe colarse como tema válido.
describe("isThemePreference", () => {
  it("distingue valores válidos de cualquier otro tipo", () => {
    expect(isThemePreference("dark")).toBe(true);
    expect(isThemePreference(42)).toBe(false);
    expect(isThemePreference(undefined)).toBe(false);
  });
});

// Caso real: con "system" el tema final depende del sistema operativo; con una elección
// explícita, el sistema no debe pesar.
describe("resolveTheme", () => {
  it("sigue al sistema cuando la preferencia es system", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });

  it("respeta la elección explícita aunque el sistema diga otra cosa", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
});

// Caso real: el script corre antes que React; si falla o se equivoca, la página parpadea
// o queda sin tema. Se ejecuta de verdad sobre el DOM de prueba.
describe("getThemeInitScript", () => {
  afterEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  const runInitScript = (storageKey?: string): void => {
    new Function(getThemeInitScript(storageKey))();
  };

  it("aplica el tema guardado en la clave por defecto", () => {
    window.localStorage.setItem(DEFAULT_THEME_STORAGE_KEY, "dark");
    runInitScript();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("usa la clave personalizada cuando se indica", () => {
    window.localStorage.setItem("mi-app-tema", "light");
    runInitScript("mi-app-tema");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("no fuerza nada si la preferencia es system o no hay valor guardado", () => {
    window.localStorage.setItem(DEFAULT_THEME_STORAGE_KEY, "system");
    runInitScript();
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });

  it("ignora valores inválidos en lugar de aplicarlos", () => {
    window.localStorage.setItem(DEFAULT_THEME_STORAGE_KEY, "azul");
    runInitScript();
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });
});
