// Utilidades puras de color para los temas: validación de hex, mezcla y contraste mínimo.
import { contrastRatio } from "../tokens/contrast";

/** Contraste mínimo WCAG AA para texto. */
export const AA_TEXT = 4.5;
/** Contraste mínimo WCAG AA para bordes y componentes de interfaz. */
export const AA_UI_COMPONENT = 3;

export const BLACK = "#000000";
export const WHITE = "#ffffff";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

/** Variables CSS listas para aplicar en un elemento (`style`) o volcar a una hoja. */
export type ThemeVariables = Record<`--farol-${string}`, string>;

export const assertHex = (color: string, name: string): void => {
  if (!HEX_COLOR.test(color)) {
    throw new Error(
      `${name} tiene que ser un hex de 6 dígitos (#rrggbb): ${color}`,
    );
  }
};

const toHexPart = (value: number): string =>
  Math.round(value).toString(16).padStart(2, "0");

/** Mezcla `amount` (0 a 1) de `other` dentro de `color`. */
export const mix = (color: string, other: string, amount: number): string => {
  const parts = (hex: string) =>
    [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));
  const [red, green, blue] = parts(color).map(
    (channel, index) => channel + (parts(other)[index] - channel) * amount,
  );
  return `#${toHexPart(red)}${toHexPart(green)}${toHexPart(blue)}`;
};

/** El color más cercano a `color`, hacia `target`, que llega al contraste mínimo sobre todos los fondos. */
export const adjustForContrast = (
  color: string,
  backgrounds: readonly string[],
  target: string,
): string => {
  for (let step = 0; step <= 20; step += 1) {
    const candidate = mix(color, target, step / 20);
    if (
      backgrounds.every(
        (background) => contrastRatio(candidate, background) >= AA_TEXT,
      )
    ) {
      return candidate;
    }
  }
  return target;
};

export const assertContrast = (
  foreground: string,
  background: string,
  description: string,
  minimum: number = AA_TEXT,
): void => {
  const ratio = contrastRatio(foreground, background);
  if (ratio < minimum) {
    throw new Error(
      `${description} no llega a contraste AA (${ratio.toFixed(2)}:1, mínimo ${minimum}:1).`,
    );
  }
};

/** Arma el valor CSS `light-dark(claro, oscuro)`. */
export const lightDark = (lightValue: string, darkValue: string): string =>
  `light-dark(${lightValue}, ${darkValue})`;
