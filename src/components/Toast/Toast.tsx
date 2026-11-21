import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cx } from "../../utils/classNames";
import { getStatusRole } from "../../utils/tones";
import {
  DEFAULT_MAX_TOASTS,
  DEFAULT_TOAST_DURATION,
  addToast,
  getRemainingTime,
  removeToast,
  type ToastItem,
  type ToastTone,
} from "./toastQueue";
import tones from "../../styles/tones.module.css";
import styles from "./Toast.module.css";

export interface ShowToastOptions {
  message: string;
  tone?: ToastTone;
  /** Milisegundos hasta cerrarse solo; 0 lo deja hasta que se cierre a mano. */
  duration?: number;
}

interface ToastContextValue {
  /** Muestra un aviso y devuelve su id (sirve para cerrarlo con `dismissToast`). */
  showToast: (options: ShowToastOptions) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastViewProps {
  toast: ToastItem;
  closeLabel: string;
  onDismiss: (id: string) => void;
}

const ToastView = ({ toast, closeLabel, onDismiss }: ToastViewProps) => {
  const { id, duration } = toast;
  // Pausa mientras el mouse está encima o el foco está adentro (WCAG 2.2.1: quien lee
  // despacio o navega con teclado no puede perder el mensaje).
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const isPaused = isHovered || hasFocus;
  const remainingRef = useRef(duration);

  useEffect(() => {
    if (duration <= 0 || isPaused) {
      return;
    }
    const startedAt = Date.now();
    const timer = window.setTimeout(() => onDismiss(id), remainingRef.current);
    // Al pausar (o desmontar) se descuenta lo que ya pasó para reanudar con el resto.
    return () => {
      window.clearTimeout(timer);
      remainingRef.current = getRemainingTime(
        duration,
        remainingRef.current,
        Date.now() - startedAt,
      );
    };
  }, [id, duration, isPaused, onDismiss]);

  return (
    <div
      role={getStatusRole(toast.tone)}
      className={cx(styles.toast, tones[toast.tone])}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
    >
      <p className={styles.message}>{toast.message}</p>
      <button
        type="button"
        className={styles.close}
        aria-label={closeLabel}
        onClick={() => onDismiss(id)}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
};

export interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
  /** Texto accesible del botón de cerrar (cambiarlo para traducirlo). */
  closeLabel?: string;
  /** Nombre accesible de la zona de avisos (cambiarlo para traducirlo). */
  regionLabel?: string;
}

export const ToastProvider = ({
  children,
  maxToasts = DEFAULT_MAX_TOASTS,
  closeLabel = "Dismiss",
  regionLabel = "Notifications",
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismissToast = useCallback(
    (id: string) => setToasts((current) => removeToast(current, id)),
    [],
  );

  const showToast = useCallback(
    ({
      message,
      tone = "info",
      duration = DEFAULT_TOAST_DURATION,
    }: ShowToastOptions) => {
      nextId.current += 1;
      const id = `toast-${nextId.current}`;
      setToasts((current) =>
        addToast(current, { id, message, tone, duration }, maxToasts),
      );
      return id;
    },
    [maxToasts],
  );

  const value = useMemo(
    () => ({ showToast, dismissToast }),
    [showToast, dismissToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <section className={styles.region} aria-label={regionLabel}>
        {toasts.map((toast) => (
          <ToastView
            key={toast.id}
            toast={toast}
            closeLabel={closeLabel}
            onDismiss={dismissToast}
          />
        ))}
      </section>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de <ToastProvider>.");
  }
  return context;
};
