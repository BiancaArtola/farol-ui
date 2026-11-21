import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import { DEFAULT_THEME_STORAGE_KEY } from "./theme";

// jsdom no trae matchMedia: se simula uno que permite cambiar la preferencia del sistema.
const stubSystemTheme = (initiallyDark: boolean) => {
  let matches = initiallyDark;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      get matches() {
        return matches;
      },
      addEventListener: (_type: string, listener: never) =>
        listeners.add(listener),
      removeEventListener: (_type: string, listener: never) =>
        listeners.delete(listener),
    })),
  );
  return {
    changeTo: (isDark: boolean) => {
      matches = isDark;
      listeners.forEach((listener) =>
        listener({ matches: isDark } as MediaQueryListEvent),
      );
    },
  };
};

const ThemeProbe = () => {
  const { preference, theme, setPreference, toggleTheme } = useTheme();
  return (
    <div>
      <p data-testid="state">{`${preference}/${theme}`}</p>
      <button onClick={toggleTheme}>alternar</button>
      <button onClick={() => setPreference("system")}>sistema</button>
    </div>
  );
};

const renderProbe = () =>
  render(
    <ThemeProvider>
      <ThemeProbe />
    </ThemeProvider>,
  );

// Caso real: el portfolio recuerda la elección de tema y, sin elección, sigue al sistema.
describe("ThemeProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sin elección guardada sigue al sistema y no fuerza data-theme", () => {
    stubSystemTheme(true);
    renderProbe();
    expect(screen.getByTestId("state")).toHaveTextContent("system/dark");
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });

  it("usa la elección guardada al montar", () => {
    stubSystemTheme(false);
    window.localStorage.setItem(DEFAULT_THEME_STORAGE_KEY, "dark");
    renderProbe();
    expect(screen.getByTestId("state")).toHaveTextContent("dark/dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("alternar fuerza el tema opuesto al que se ve y lo guarda", async () => {
    stubSystemTheme(true);
    renderProbe();
    await userEvent.click(screen.getByText("alternar"));
    expect(screen.getByTestId("state")).toHaveTextContent("light/light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(window.localStorage.getItem(DEFAULT_THEME_STORAGE_KEY)).toBe(
      "light",
    );
  });

  it("volver a system libera data-theme", async () => {
    stubSystemTheme(false);
    window.localStorage.setItem(DEFAULT_THEME_STORAGE_KEY, "dark");
    renderProbe();
    await userEvent.click(screen.getByText("sistema"));
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
    expect(screen.getByTestId("state")).toHaveTextContent("system/light");
  });

  it("reacciona cuando el sistema cambia mientras se usa system", () => {
    const system = stubSystemTheme(false);
    renderProbe();
    expect(screen.getByTestId("state")).toHaveTextContent("system/light");
    act(() => system.changeTo(true));
    expect(screen.getByTestId("state")).toHaveTextContent("system/dark");
  });

  it("sigue funcionando si localStorage está bloqueado", async () => {
    stubSystemTheme(false);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    renderProbe();
    await userEvent.click(screen.getByText("alternar"));
    expect(screen.getByTestId("state")).toHaveTextContent("dark/dark");
    vi.restoreAllMocks();
  });
});

// Caso real: usar el hook sin el provider da un tema "mudo" y bugs difíciles de rastrear;
// es mejor un error claro.
describe("useTheme", () => {
  it("falla con un mensaje claro fuera de ThemeProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(<ThemeProbe />)).toThrow("<ThemeProvider>");
    vi.restoreAllMocks();
  });
});
