// Paleta neutra del tema (fondos, texto, bordes): permite fondos cálidos, fríos u oscuros
// propios. Es lógica pura y valida el contraste de cada par que los componentes usan juntos.
import {
  AA_UI_COMPONENT,
  assertContrast,
  assertHex,
  lightDark,
  type ThemeVariables,
} from "./colors";

export interface NeutralColors {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  borderStrong: string;
}

export interface ThemeNeutrals {
  light: NeutralColors;
  dark: NeutralColors;
}

const NEUTRAL_VARIABLES = {
  bg: "--farol-color-bg",
  surface: "--farol-color-surface",
  text: "--farol-color-text",
  muted: "--farol-color-text-muted",
  border: "--farol-color-border",
  borderStrong: "--farol-color-border-strong",
} as const satisfies Record<keyof NeutralColors, `--farol-${string}`>;

const NEUTRAL_KEYS = Object.keys(NEUTRAL_VARIABLES) as (keyof NeutralColors)[];

const assertScheme = (colors: NeutralColors, scheme: string): void => {
  NEUTRAL_KEYS.forEach((key) => assertHex(colors[key], `${key} (${scheme})`));
  for (const background of ["bg", "surface"] as const) {
    assertContrast(
      colors.text,
      colors[background],
      `El texto sobre ${background} (${scheme})`,
    );
    assertContrast(
      colors.muted,
      colors[background],
      `El texto secundario sobre ${background} (${scheme})`,
    );
  }
  assertContrast(
    colors.borderStrong,
    colors.bg,
    `El borde marcado (${scheme})`,
    AA_UI_COMPONENT,
  );
};

/** Valida la paleta y la convierte a variables `light-dark()`. */
export const neutralVariables = (neutrals: ThemeNeutrals): ThemeVariables => {
  assertScheme(neutrals.light, "claro");
  assertScheme(neutrals.dark, "oscuro");
  const variables: ThemeVariables = {};
  for (const key of NEUTRAL_KEYS) {
    variables[NEUTRAL_VARIABLES[key]] = lightDark(
      neutrals.light[key],
      neutrals.dark[key],
    );
  }
  return variables;
};
