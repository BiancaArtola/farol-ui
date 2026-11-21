// Crea un tema a partir de pocos datos (color de marca, tipografía, redondeo) y lo
// devuelve como variables CSS --farol-*. Es lógica pura: no toca el DOM, y valida el
// contraste con contrast.ts para que ninguna marca deje texto ilegible.
import { contrastRatio } from "../tokens/contrast";

const AA_TEXT = 4.5;

// Fondos de los tokens por defecto (tokens.css): la marca tiene que leerse sobre ellos.
const LIGHT_BACKGROUND = "#ffffff";
const DARK_BACKGROUND = "#1d1e20";
const LIGHT_CONTRAST_TEXT = "#ffffff";
const DARK_CONTRAST_TEXT = "#0b1220";

/** Copia de los valores de tokens.css que usa este módulo; tokens.test.ts verifica que coincidan. */
export const TOKEN_REFERENCE_COLORS = {
  bg: { light: LIGHT_BACKGROUND, dark: DARK_BACKGROUND },
  "primary-contrast": { light: LIGHT_CONTRAST_TEXT, dark: DARK_CONTRAST_TEXT },
} as const;
const BLACK = "#000000";
const WHITE = "#ffffff";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export const THEME_RADII = ["sharp", "default", "round"] as const;
export type ThemeRadius = (typeof THEME_RADII)[number];

const RADIUS_SCALES: Record<
  ThemeRadius,
  { sm: string; md: string; lg: string }
> = {
  sharp: { sm: "0px", md: "2px", lg: "4px" },
  default: { sm: "4px", md: "8px", lg: "12px" },
  round: { sm: "8px", md: "12px", lg: "20px" },
};

/** Un color de marca: un solo hex (se deriva el oscuro) o un par explícito. */
export type BrandColor = string | { light: string; dark: string };

export interface ThemeOptions {
  /** Color de marca. Con un solo hex, se ajusta para que se lea en claro y en oscuro. */
  primary: BrandColor;
  /** Tipografía de todos los componentes, por ejemplo `"Inter", system-ui, sans-serif`. */
  fontFamily?: string;
  radius?: ThemeRadius;
}

/** Variables CSS listas para aplicar en un elemento (`style`) o volcar a una hoja. */
export type ThemeVariables = Record<`--farol-${string}`, string>;

const assertHex = (color: string, name: string): void => {
  if (!HEX_COLOR.test(color)) {
    throw new Error(
      `${name} tiene que ser un hex de 6 dígitos (#rrggbb): ${color}`,
    );
  }
};

const toHexPart = (value: number): string =>
  Math.round(value).toString(16).padStart(2, "0");

/** Mezcla `amount` (0 a 1) de `other` dentro de `color`. */
const mix = (color: string, other: string, amount: number): string => {
  const parts = (hex: string) =>
    [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));
  const [red, green, blue] = parts(color).map(
    (channel, index) => channel + (parts(other)[index] - channel) * amount,
  );
  return `#${toHexPart(red)}${toHexPart(green)}${toHexPart(blue)}`;
};

/** El color más cercano a `color`, hacia `target`, que llega al contraste mínimo sobre `background`. */
const adjustForContrast = (
  color: string,
  background: string,
  target: string,
): string => {
  for (let step = 0; step <= 20; step += 1) {
    const candidate = mix(color, target, step / 20);
    if (contrastRatio(candidate, background) >= AA_TEXT) {
      return candidate;
    }
  }
  return target;
};

const readableTextOn = (background: string): string =>
  contrastRatio(LIGHT_CONTRAST_TEXT, background) >=
  contrastRatio(DARK_CONTRAST_TEXT, background)
    ? LIGHT_CONTRAST_TEXT
    : DARK_CONTRAST_TEXT;

const assertAA = (
  foreground: string,
  background: string,
  description: string,
): void => {
  const ratio = contrastRatio(foreground, background);
  if (ratio < AA_TEXT) {
    throw new Error(
      `${description} no llega a contraste AA (${ratio.toFixed(2)}:1, mínimo ${AA_TEXT}:1).`,
    );
  }
};

interface BrandScheme {
  base: string;
  hover: string;
  contrast: string;
}

const buildScheme = (
  color: string,
  background: string,
  hoverTarget: string,
  isExplicit: boolean,
  name: string,
): BrandScheme => {
  assertHex(color, name);
  // Un hex suelto se corrige solo; un par explícito lo eligió la persona, así que se valida.
  const base = isExplicit
    ? color
    : adjustForContrast(
        color,
        background,
        background === LIGHT_BACKGROUND ? BLACK : WHITE,
      );
  const hover = mix(base, hoverTarget, 0.2);
  const contrast = readableTextOn(base);
  assertAA(base, background, `El color ${name}`);
  assertAA(contrast, base, `El texto sobre ${name}`);
  assertAA(contrast, hover, `El texto sobre ${name} al pasar el mouse`);
  return { base, hover, contrast };
};

export const createTheme = ({
  primary,
  fontFamily,
  radius = "default",
}: ThemeOptions): ThemeVariables => {
  const isExplicit = typeof primary !== "string";
  const lightColor = typeof primary === "string" ? primary : primary.light;
  const darkColor = typeof primary === "string" ? primary : primary.dark;
  const light = buildScheme(
    lightColor,
    LIGHT_BACKGROUND,
    BLACK,
    isExplicit,
    "primary (claro)",
  );
  const dark = buildScheme(
    darkColor,
    DARK_BACKGROUND,
    WHITE,
    isExplicit,
    "primary (oscuro)",
  );
  const pair = (lightValue: string, darkValue: string): string =>
    `light-dark(${lightValue}, ${darkValue})`;

  const variables: ThemeVariables = {
    "--farol-color-primary": pair(light.base, dark.base),
    "--farol-color-primary-hover": pair(light.hover, dark.hover),
    "--farol-color-primary-contrast": pair(light.contrast, dark.contrast),
    "--farol-color-focus": pair(light.base, dark.hover),
    "--farol-radius-sm": RADIUS_SCALES[radius].sm,
    "--farol-radius-md": RADIUS_SCALES[radius].md,
    "--farol-radius-lg": RADIUS_SCALES[radius].lg,
  };
  if (fontFamily) {
    variables["--farol-font-family"] = fontFamily;
  }
  return variables;
};

/** Convierte un tema a CSS (`:root { ... }`) para hojas estáticas o renderizado en servidor. */
export const themeToCss = (
  variables: ThemeVariables,
  selector = ":root",
): string => {
  const declarations = Object.entries(variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
  return `${selector} {\n${declarations}\n}\n`;
};
