import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Modal } from "../Modal/Modal";

export interface ConfirmOptions {
  message: string;
  title?: string;
  confirmLabel?: string;
  /** Acción destructiva: el botón de confirmar usa la variante de peligro. */
  isDanger?: boolean;
}

export interface PromptOptions {
  message: string;
  title?: string;
  initialValue?: string;
  placeholder?: string;
  confirmLabel?: string;
}

export interface DialogLabels {
  cancel: string;
  confirmTitle: string;
  confirm: string;
  promptTitle: string;
  accept: string;
  close: string;
}

const DEFAULT_LABELS: DialogLabels = {
  cancel: "Cancel",
  confirmTitle: "Confirm",
  confirm: "Confirm",
  promptTitle: "Enter a value",
  accept: "Accept",
  close: "Close",
};

export interface DialogApi {
  /** Resuelve `true` si se confirma y `false` si se cancela, con Escape o clic afuera. */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  /** Resuelve el texto ingresado, o `null` si se cancela. */
  prompt: (options: PromptOptions) => Promise<string | null>;
}

type DialogRequest =
  | {
      kind: "confirm";
      options: ConfirmOptions;
      settle: (isAccepted: boolean) => void;
    }
  | {
      kind: "prompt";
      options: PromptOptions;
      settle: (text: string | null) => void;
    };

// Sin provider (tests de componentes sueltos) se comporta como "cancelar": no se cuelga.
const DialogContext = createContext<DialogApi>({
  confirm: async () => false,
  prompt: async () => null,
});

export interface DialogProviderProps {
  children: ReactNode;
  /** Textos de los botones y títulos por defecto (cambiarlos para traducir). */
  labels?: Partial<DialogLabels>;
}

/**
 * Reemplaza `confirm()` y `prompt()` nativos: `await confirm({ message })` abre un
 * `Modal` de la app y resuelve cuando la persona decide.
 */
export const DialogProvider = ({ children, labels }: DialogProviderProps) => {
  const text = { ...DEFAULT_LABELS, ...labels };
  const formId = useId();
  const [request, setRequest] = useState<DialogRequest | null>(null);
  const [value, setValue] = useState("");
  // Referencia a la solicitud vigente: permite resolverla una sola vez y cancelar la
  // anterior si llega otra mientras hay un diálogo abierto.
  const requestRef = useRef<DialogRequest | null>(null);

  // Única vía para cerrar: acepta o cancela la solicitud vigente, una sola vez.
  const finish = useCallback((isAccepted: boolean, text = "") => {
    const current = requestRef.current;
    if (!current) {
      return;
    }
    requestRef.current = null;
    setRequest(null);
    if (current.kind === "confirm") {
      current.settle(isAccepted);
    } else {
      current.settle(isAccepted ? text : null);
    }
  }, []);
  const cancel = useCallback(() => finish(false), [finish]);

  const open = useCallback(
    (next: DialogRequest) => {
      cancel();
      requestRef.current = next;
      setValue(next.kind === "prompt" ? (next.options.initialValue ?? "") : "");
      setRequest(next);
    },
    [cancel],
  );

  const api = useMemo<DialogApi>(
    () => ({
      confirm: (options) =>
        new Promise<boolean>((settle) =>
          open({ kind: "confirm", options, settle }),
        ),
      prompt: (options) =>
        new Promise<string | null>((settle) =>
          open({ kind: "prompt", options, settle }),
        ),
    }),
    [open],
  );

  const accept = (event: FormEvent) => {
    event.preventDefault();
    finish(true, value);
  };

  const isPrompt = request?.kind === "prompt";
  const options = request?.options;
  const isDanger = request?.kind === "confirm" && request.options.isDanger;

  return (
    <DialogContext.Provider value={api}>
      {children}
      <Modal
        open={request !== null}
        onClose={cancel}
        title={
          options?.title ?? (isPrompt ? text.promptTitle : text.confirmTitle)
        }
        closeLabel={text.close}
        footer={
          <>
            <Button variant="secondary" onClick={cancel}>
              {text.cancel}
            </Button>
            <Button
              type="submit"
              form={formId}
              variant={isDanger ? "danger" : "primary"}
            >
              {options?.confirmLabel ?? (isPrompt ? text.accept : text.confirm)}
            </Button>
          </>
        }
      >
        <form id={formId} onSubmit={accept}>
          {isPrompt ? (
            <Input
              label={options?.message ?? ""}
              value={value}
              placeholder={
                request?.kind === "prompt"
                  ? request.options.placeholder
                  : undefined
              }
              onChange={(event) => setValue(event.target.value)}
            />
          ) : (
            <p>{options?.message}</p>
          )}
        </form>
      </Modal>
    </DialogContext.Provider>
  );
};

export const useDialog = (): DialogApi => useContext(DialogContext);
