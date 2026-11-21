import { useEffect, useRef, type RefObject } from "react";

export type DismissReason = "escape" | "outside";

/**
 * Cierra un elemento flotante (popover, menú) con Escape o con un clic fuera de su
 * contenedor, solo mientras está abierto. Quien lo usa decide qué hacer con el foco según
 * el motivo: con Escape vuelve al disparador; con un clic fuera, el foco ya está en otro lado.
 */
export const useDismiss = (
  isOpen: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onDismiss: (reason: DismissReason) => void,
): void => {
  // En un ref para que cambiar onDismiss en cada render no reinicie los listeners.
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Se corta acá para que un Modal que contenga este elemento flotante no se cierre
        // también: Escape cierra primero lo de más arriba.
        event.stopPropagation();
        onDismissRef.current("escape");
      }
    };
    const handleMouseDown = (event: MouseEvent) => {
      const container = containerRef.current;
      if (container && !container.contains(event.target as Node)) {
        onDismissRef.current("outside");
      }
    };
    // En captura: corre antes que el listener (en burbuja) del Modal.
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isOpen, containerRef]);
};
