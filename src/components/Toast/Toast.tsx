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
import {
  DEFAULT_MAX_TOASTS,
  DEFAULT_TOAST_DURATION,
  addToast,
  removeToast,
  type ToastItem,
  type ToastTone,
} from "./toastQueue";
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

// Errores y advertencias se anuncian de inmediato; el resto, sin interrumpir.
const INTERRUPTING_TONES: readonly ToastTone[] = ["warning", "danger"];

interface ToastViewProps {
  toast: ToastItem;
  closeLabel: string;
  onDismiss: (id: string) => void;
}

const ToastView = ({ toast, closeLabel, onDismiss }: ToastViewProps) => {
  const { id, duration } = toast;

  useEffect(() => {
    if (duration <= 0) {
      return;
    }
    const timer = window.setTimeout(() => onDismiss(id), duration);
    return () => window.clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <div
      role={INTERRUPTING_TONES.includes(toast.tone) ? "alert" : "status"}
      className={cx(styles.toast, styles[toast.tone])}
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
