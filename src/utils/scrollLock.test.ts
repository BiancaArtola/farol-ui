import { afterEach, describe, expect, it } from "vitest";
import { lockScroll } from "./scrollLock";

afterEach(() => {
  document.body.style.overflow = "";
});

// Caso real: un diálogo abre otro encima (por ejemplo una confirmación sobre un panel
// lateral) y se cierran en cualquier orden; la página no puede quedar sin scroll.
describe("lockScroll", () => {
  it("bloquea el scroll y lo restaura al soltar", () => {
    document.body.style.overflow = "auto";
    const unlock = lockScroll();
    expect(document.body.style.overflow).toBe("hidden");
    unlock();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("con dos bloqueos solo libera al soltar el último, en cualquier orden", () => {
    const unlockFirst = lockScroll();
    const unlockSecond = lockScroll();
    unlockFirst();
    expect(document.body.style.overflow).toBe("hidden");
    unlockSecond();
    expect(document.body.style.overflow).toBe("");
  });

  it("soltar dos veces el mismo bloqueo no libera el de otro", () => {
    const unlockFirst = lockScroll();
    const unlockSecond = lockScroll();
    unlockFirst();
    unlockFirst();
    expect(document.body.style.overflow).toBe("hidden");
    unlockSecond();
  });
});
