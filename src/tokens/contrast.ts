// Cálculo de contraste WCAG 2.x entre dos colores hexadecimales de 6 dígitos.
// Sirve para verificar en tests que los pares de tokens cumplen AA.

const HEX_COLOR = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

const toLinearChannel = (channel: number): number => {
  const unit = channel / 255;
  return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
};

export const relativeLuminance = (hexColor: string): number => {
  const match = HEX_COLOR.exec(hexColor);
  if (!match) {
    throw new Error(`Color hexadecimal inválido: ${hexColor}`);
  }
  const [red, green, blue] = [match[1], match[2], match[3]].map((part) =>
    toLinearChannel(parseInt(part, 16)),
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

export const contrastRatio = (
  firstColor: string,
  secondColor: string,
): number => {
  const firstLuminance = relativeLuminance(firstColor);
  const secondLuminance = relativeLuminance(secondColor);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
};
