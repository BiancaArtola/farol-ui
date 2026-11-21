import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getFocusableElements, trapTabKey } from "./focus";

const buildContainer = (): HTMLElement => {
  const container = document.createElement("div");
  container.tabIndex = -1;
  container.innerHTML = `
    <button id="primero">Primero</button>
    <input id="medio" />
    <button id="deshabilitado" disabled>No</button>
    <a id="enlace" href="#x">Enlace</a>
    <input id="oculto" type="hidden" />
    <div id="saltado" tabindex="-1">No entra en la secuencia</div>
  `;
  document.body.appendChild(container);
  return container;
};

const press = (key: string, shiftKey = false) => ({
  key,
  shiftKey,
  preventDefault: vi.fn(),
});

// Caso real: un modal abierto no debe dejar que Tab escape hacia la página de atrás; y los
// elementos deshabilitados u ocultos no pueden recibir foco.
describe("getFocusableElements", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("devuelve solo lo enfocable, en orden", () => {
    const container = buildContainer();
    expect(getFocusableElements(container).map((el) => el.id)).toEqual([
      "primero",
      "medio",
      "enlace",
    ]);
  });
});

describe("trapTabKey", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = buildContainer();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("desde el último elemento, Tab vuelve al primero", () => {
    document.getElementById("enlace")?.focus();
    const event = press("Tab");
    expect(trapTabKey(event, container)).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(document.activeElement?.id).toBe("primero");
  });

  it("desde el primero, Shift+Tab salta al último", () => {
    document.getElementById("primero")?.focus();
    const event = press("Tab", true);
    expect(trapTabKey(event, container)).toBe(true);
    expect(document.activeElement?.id).toBe("enlace");
  });

  it("desde el propio contenedor, Shift+Tab salta al último", () => {
    container.focus();
    expect(trapTabKey(press("Tab", true), container)).toBe(true);
    expect(document.activeElement?.id).toBe("enlace");
  });

  it("en el medio deja que el navegador mueva el foco", () => {
    document.getElementById("medio")?.focus();
    const event = press("Tab");
    expect(trapTabKey(event, container)).toBe(false);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("ignora otras teclas", () => {
    document.getElementById("enlace")?.focus();
    expect(trapTabKey(press("Enter"), container)).toBe(false);
  });

  it("sin elementos enfocables, Tab no escapa del contenedor", () => {
    const empty = document.createElement("div");
    document.body.appendChild(empty);
    const event = press("Tab");
    expect(trapTabKey(event, empty)).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
