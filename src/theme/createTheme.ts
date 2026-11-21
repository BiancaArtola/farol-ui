// Crea un tema a partir de pocos datos (color de marca, tipografía, redondeo) y lo
// devuelve como variables CSS --farol-*. Es lógica pura: no toca el DOM, y valida el
// contraste con contrast.ts para que ninguna marca deje texto ilegible.
import { contrastRatio } from "../tokens/contrast";
import {
  AA_UI_COMPONENT,
  BLACK,
  WHITE,
  adjustForContrast,
  assertContrast,
  assertHex,
  lightDark,
  mix,
  type ThemeVariables,
} from "./colors";
import { neutralVariables, type ThemeNeutrals } from "./neutrals";
import { shapeVariables, type ThemeShape } from "./shape";

export type { ThemeVariables } from "./colors";
export type { NeutralColors, ThemeNeutrals } from "./neutrals";
export * from "./shape";

// Fondos de los tokens por defecto (tokens.css): la marca tiene que leerse sobre ellos.
const DEFAULT_PAGE = {
  light: { bg: "#ffffff", surface: "#f6f8fb" },
  dark: { bg: "#1d1e20", surface: "#26282c" },
} as const;
const LIGHT_CONTRAST_TEXT = "#ffffff";
const DARK_CONTRAST_TEXT = "#0b1220";

/** Copia de los valores de tokens.css que usa este módulo; tokens.test.ts verifica que coincidan. */
export const TOKEN_REFERENCE_COLORS = {
  bg: { light: DEFAULT_PAGE.light.bg, dark: DEFAULT_PAGE.dark.bg },
  surface: {
    light: DEFAULT_PAGE.light.surface,
    dark: DEFAULT_PAGE.dark.surface,
  },
  "primary-contrast": { light: LIGHT_CONTRAST_TEXT, dark: DARK_CONTRAST_TEXT },
} as const;

/** Un color de marca: un solo hex (se deriva el oscuro) o un par explícito. */
export type BrandColor = string | { light: string; dark: string };

export interface ThemeOptions extends ThemeShape {
  /** Color de marca. Con un solo hex, se ajusta para que se lea en claro y en oscuro. */
  primary: BrandColor;
  /** Tipografía de todos los componentes, por ejemplo `"Inter", system-ui, sans-serif`. */
  fontFamily?: string;
  /** Fondos, texto y bordes propios; sin esto se usan los neutros por defecto. */
  neutrals?: ThemeNeutrals;
}

const readableTextOn = (background: string): string =>
  contrastRatio(LIGHT_CONTRAST_TEXT, background) >=
  contrastRatio(DARK_CONTRAST_TEXT, background)
    ? LIGHT_CONTRAST_TEXT
    : DARK_CONTRAST_TEXT;

interface BrandScheme {
  base: string;
  hover: string;
  contrast: string;
}

interface SchemeInput {
  color: string;
  /** Fondos sobre los que la marca se usa como texto o borde. */
  backgrounds: readonly string[];
  /** Hacia dónde se aclara u oscurece: negro en claro, blanco en oscuro. */
  towards: string;
  isExplicit: boolean;
  name: string;
}

const buildScheme = ({
  color,
  backgrounds,
  towards,
  isExplicit,
  name,
}: SchemeInput): BrandScheme => {
  assertHex(color, name);
  // Un hex suelto se corrige solo; un par explícito lo eligió la persona, así que se valida.
  const base = isExplicit
    ? color
    : adjustForContrast(color, backgrounds, towards);
  const hover = mix(base, towards, 0.2);
  const contrast = readableTextOn(base);
  for (const background of backgrounds) {
    assertContrast(base, background, `El color ${name}`);
  }
  assertContrast(contrast, base, `El texto sobre ${name}`);
  assertContrast(contrast, hover, `El texto sobre ${name} al pasar el mouse`);
  return { base, hover, contrast };
};

export const createTheme = ({
  primary,
  fontFamily,
  neutrals,
  ...shape
}: ThemeOptions): ThemeVariables => {
  const isExplicit = typeof primary !== "string";
  const page = neutrals ?? DEFAULT_PAGE;
  const backgroundsOf = (scheme: "light" | "dark") => [
    page[scheme].bg,
    page[scheme].surface,
  ];
  const light = buildScheme({
    color: typeof primary === "string" ? primary : primary.light,
    backgrounds: backgroundsOf("light"),
    towards: BLACK,
    isExplicit,
    name: "primary (claro)",
  });
  const dark = buildScheme({
    color: typeof primary === "string" ? primary : primary.dark,
    backgrounds: backgroundsOf("dark"),
    towards: WHITE,
    isExplicit,
    name: "primary (oscuro)",
  });
  assertContrast(
    light.base,
    page.light.bg,
    "El borde de la marca (claro)",
    AA_UI_COMPONENT,
  );

  const variables: ThemeVariables = {
    ...(neutrals ? neutralVariables(neutrals) : {}),
    "--farol-color-primary": lightDark(light.base, dark.base),
    "--farol-color-primary-hover": lightDark(light.hover, dark.hover),
    "--farol-color-primary-contrast": lightDark(light.contrast, dark.contrast),
    "--farol-color-focus": lightDark(light.base, dark.hover),
    ...shapeVariables(shape),
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
