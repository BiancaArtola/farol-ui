// Dónde va el panel de un filtro de columna: lógica pura, sin React ni DOM.

const GAP = 4;
const VIEWPORT_MARGIN = 8;

/** Posición fija del panel. Anclado por `bottom` crece hacia arriba y no tapa el ícono. */
export interface PanelPosition {
  top?: number;
  bottom?: number;
  left: number;
  maxHeight: number;
}

export interface PanelPositionInput {
  /** Bordes del ícono que abre el panel, relativos a la ventana. */
  anchor: { top: number; bottom: number; left: number };
  panel: { width: number; height: number };
  viewport: { width: number; height: number };
}

/** ¿El ícono sigue a la vista, aunque sea en parte? Si no, no hay de dónde colgar el panel. */
export const isAnchorVisible = (
  anchor: { top: number; bottom: number },
  viewport: { height: number },
): boolean => anchor.bottom >= 0 && anchor.top <= viewport.height;

/**
 * Debajo del ícono si entra; si no, arriba si entra; y si no entra en ningún lado, ocupa la
 * ventana (tapando el ícono) y el resto se recorre con el scroll del propio panel. Desplazar la
 * página no sirve para llegar a lo cortado, porque el panel es fijo y sigue al ícono.
 */
export const computePanelPosition = ({
  anchor,
  panel,
  viewport,
}: PanelPositionInput): PanelPosition => {
  const maxLeft = viewport.width - panel.width - VIEWPORT_MARGIN;
  const left = Math.max(VIEWPORT_MARGIN, Math.min(anchor.left, maxLeft));
  const spaceBelow = viewport.height - anchor.bottom - GAP - VIEWPORT_MARGIN;
  if (panel.height <= spaceBelow) {
    return { top: anchor.bottom + GAP, left, maxHeight: spaceBelow };
  }
  const spaceAbove = anchor.top - GAP - VIEWPORT_MARGIN;
  if (panel.height <= spaceAbove) {
    return {
      bottom: viewport.height - anchor.top + GAP,
      left,
      maxHeight: spaceAbove,
    };
  }
  const maxHeight = viewport.height - 2 * VIEWPORT_MARGIN;
  return {
    top: Math.max(
      VIEWPORT_MARGIN,
      viewport.height - panel.height - VIEWPORT_MARGIN,
    ),
    left,
    maxHeight,
  };
};
