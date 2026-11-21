// Lista de avisos temporales: lógica pura, sin React ni timers.

export const TOAST_TONES = ["info", "success", "warning", "danger"] as const;
export type ToastTone = (typeof TOAST_TONES)[number];

export const DEFAULT_TOAST_DURATION = 5000;
export const DEFAULT_MAX_TOASTS = 5;

export interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
  /** Milisegundos hasta que se cierra solo; 0 lo deja hasta que se cierre a mano. */
  duration: number;
}

/**
 * Agrega un aviso al final. Si se pasa el máximo, se descartan los más viejos: una ráfaga
 * de avisos no puede tapar la pantalla.
 */
export const addToast = (
  toasts: readonly ToastItem[],
  toast: ToastItem,
  maxToasts: number = DEFAULT_MAX_TOASTS,
): ToastItem[] => [...toasts, toast].slice(-maxToasts);

export const removeToast = (
  toasts: readonly ToastItem[],
  id: string,
): ToastItem[] => toasts.filter((toast) => toast.id !== id);
