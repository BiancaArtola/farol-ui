import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { TOKEN_REFERENCE_COLORS } from "../theme/createTheme";
import { contrastRatio } from "./contrast";

type ColorScheme = "light" | "dark";
type ColorTokens = Record<string, Record<ColorScheme, string>>;

const AA_TEXT = 4.5;
const AA_UI_COMPONENT = 3;

// Lee tokens.css y arma { nombre: { light, dark } } a partir de light-dark(claro, oscuro).
const readColorTokens = (): ColorTokens => {
  const css = readFileSync(resolve(import.meta.dirname, "tokens.css"), "utf8");
  const pattern =
    /--farol-color-([a-z-]+):\s*light-dark\(\s*(#[0-9a-f]{6})\s*,\s*(#[0-9a-f]{6})\s*\)/gi;
  const tokens: ColorTokens = {};
  for (const [, name, light, dark] of css.matchAll(pattern)) {
    tokens[name] = { light, dark };
  }
  return tokens;
};

const tokens = readColorTokens();
const SCHEMES: ColorScheme[] = ["light", "dark"];

// Caso real: el portfolio pasó de amarillo a azul y de un solo tema a dos. Cada par de
// colores que los componentes usan juntos tiene que seguir siendo legible en ambos temas.
describe("tokens de color", () => {
  it("define un valor claro y uno oscuro para cada color", () => {
    expect(Object.keys(tokens).length).toBeGreaterThan(10);
  });

  describe.each(SCHEMES)("tema %s", (scheme) => {
    const ratio = (foreground: string, background: string): number =>
      contrastRatio(tokens[foreground][scheme], tokens[background][scheme]);

    it.each([
      ["text", "bg"],
      ["text", "surface"],
      ["text-muted", "bg"],
      ["text-muted", "surface"],
      ["primary-contrast", "primary"],
      ["primary-contrast", "primary-hover"],
      ["info", "info-bg"],
      ["success", "success-bg"],
      ["warning", "warning-bg"],
      ["danger", "danger-bg"],
      ["danger", "bg"],
    ])("%s sobre %s cumple AA para texto", (foreground, background) => {
      expect(ratio(foreground, background)).toBeGreaterThanOrEqual(AA_TEXT);
    });

    it.each([
      ["primary", "bg"],
      ["focus", "bg"],
      ["border-strong", "bg"],
    ])(
      "%s sobre %s cumple AA para componentes de interfaz",
      (foreground, background) => {
        expect(ratio(foreground, background)).toBeGreaterThanOrEqual(
          AA_UI_COMPONENT,
        );
      },
    );
  });
});

// Caso real: createTheme valida el contraste contra fondos copiados de tokens.css. Si los
// tokens cambian y la copia no, un tema "válido" podría ser ilegible sobre el fondo real.
describe("colores de referencia de createTheme", () => {
  it.each(Object.entries(TOKEN_REFERENCE_COLORS))(
    "%s coincide con tokens.css",
    (name, expected) => {
      expect(tokens[name]).toEqual(expected);
    },
  );
});
