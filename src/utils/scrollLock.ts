// Contador de bloqueos: con dos diálogos abiertos, el scroll solo se libera al cerrar el
// último, sin importar en qué orden se cierren (guardar/restaurar `overflow` en cada uno
// dejaba la página trabada si se cerraban al revés).
let activeLocks = 0;
let originalOverflow = "";

/** Bloquea el scroll del fondo y devuelve la función que quita ese bloqueo. */
export const lockScroll = (): (() => void) => {
  if (activeLocks === 0) {
    originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  activeLocks += 1;

  let isReleased = false;
  return () => {
    if (isReleased) {
      return;
    }
    isReleased = true;
    activeLocks -= 1;
    if (activeLocks === 0) {
      document.body.style.overflow = originalOverflow;
    }
  };
};
