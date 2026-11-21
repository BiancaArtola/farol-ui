// Lista de avisos temporales: lógica pura, sin React ni timers.
import { STATUS_TONES, type StatusTone } from "../../utils/tones";

export const TOAST_TONES = STATUS_TONES;
export type ToastTone = StatusTone;

export const DEFAULT_TOAST_DURATION = 5000;
export const DEFAULT_MAX_TOASTS = 5;
/** Tiempo mínimo que sigue visible un aviso después de que se lo deja de pausar. */
const MIN_RESUME_TIME = 1000;

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

/**
 * Tiempo que le queda a un aviso al reanudarse tras una pausa (mouse encima o foco adentro).
 * Nunca baja de MIN_RESUME_TIME, así quien lo estaba leyendo no lo ve desaparecer al instante
 * de soltarlo; y nunca supera la duración original.
 */
export const getRemainingTime = (
  duration: number,
  remaining: number,
  elapsed: number,
): number => Math.max(remaining - elapsed, Math.min(duration, MIN_RESUME_TIME));
