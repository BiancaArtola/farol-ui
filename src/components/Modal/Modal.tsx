import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../../utils/classNames";
import { CloseButton } from "../CloseButton/CloseButton";
import { getFocusableElements, trapTabKey } from "../../utils/focus";
import { lockScroll } from "../../utils/scrollLock";
import styles from "./Modal.module.css";

export const MODAL_PLACEMENTS = ["center", "right"] as const;
export type ModalPlacement = (typeof MODAL_PLACEMENTS)[number];

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Título visible; también es el nombre accesible del diálogo. */
  title: string;
  children: ReactNode;
  /** Contenido del pie, por ejemplo los botones de acción. */
  footer?: ReactNode;
  /** "center" es un diálogo; "right" es un panel lateral. */
  placement?: ModalPlacement;
  /** Texto accesible del botón de cerrar (cambiarlo para traducirlo). */
  closeLabel?: string;
}

export const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  placement = "center",
  closeLabel = "Close",
}: ModalProps) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  // Se guarda en un ref para que cambiar onClose en cada render no reinicie el efecto
  // (reiniciarlo volvería a mover el foco).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Al abrir: guarda quién tenía el foco, lo mueve adentro, bloquea el scroll de fondo (lockScroll) y
  // escucha Escape y Tab a nivel de documento (el diálogo no es un elemento interactivo).
  // Al cerrar: devuelve el foco y restaura todo.
  useEffect(() => {
    if (!open || !dialogRef.current) {
      return;
    }
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const unlockScroll = lockScroll();
    // Un elemento con data-autofocus (por ejemplo el buscador de una paleta) tiene prioridad;
    // si no hay, el primero enfocable.
    (
      dialog.querySelector<HTMLElement>("[data-autofocus]") ??
      getFocusableElements(dialog)[0] ??
      dialog
    ).focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      trapTabKey(event, dialog);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      unlockScroll();
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  // Solo cuenta el clic que empieza y termina en el fondo, no uno que arrastra desde adentro.
  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    // El fondo solo cierra con el mouse; el teclado cierra con Escape (listener de documento).
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cx(styles.backdrop, styles[placement])}
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx(styles.dialog, styles[`dialog-${placement}`])}
      >
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <CloseButton label={closeLabel} onClick={onClose} />
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
};
