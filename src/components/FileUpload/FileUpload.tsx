import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { cx } from "../../utils/classNames";
import { CloseButton } from "../CloseButton/CloseButton";
import { Field } from "../Field/Field";
import type { FieldOwnProps } from "../Field/fieldProps";
import {
  formatFileSize,
  validateFiles,
  type FileRejectReason,
  type RejectedFile,
} from "./fileValidation";
import styles from "./FileUpload.module.css";

export interface FileUploadProps extends FieldOwnProps {
  id?: string;
  /** Igual que `accept` de <input type="file">: ".pdf, image/*". */
  accept?: string;
  multiple?: boolean;
  maxSizeBytes?: number;
  disabled?: boolean;
  /** Recibe la lista completa de archivos aceptados cada vez que cambia. */
  onChange?: (files: File[]) => void;
  /** Se llama con los archivos que no cumplieron el tipo o el tamaño. */
  onReject?: (rejected: RejectedFile<File>[]) => void;
  /** Texto de la zona de arrastre. */
  dropHint?: string;
  /** Texto accesible del botón que quita un archivo: recibe el nombre. */
  formatRemoveLabel?: (fileName: string) => string;
  /** Mensaje de error cuando se rechazan archivos. */
  formatRejection?: (rejected: RejectedFile<File>[]) => string;
}

const REJECT_TEXTS: Record<FileRejectReason, string> = {
  type: "tipo de archivo no permitido",
  size: "supera el tamaño máximo",
};

const defaultFormatRejection = (rejected: RejectedFile<File>[]): string =>
  rejected
    .map(({ file, reason }) => `${file.name}: ${REJECT_TEXTS[reason]}`)
    .join(". ");

/**
 * Selector de archivos con zona para arrastrar. El control real es un <input type="file">,
 * así que el teclado y los lectores de pantalla funcionan como siempre; arrastrar es un extra.
 */
export const FileUpload = ({
  accept,
  multiple = false,
  maxSizeBytes,
  disabled,
  onChange,
  onReject,
  dropHint = "o arrastrar los archivos hasta acá",
  formatRemoveLabel = (fileName) => `Quitar ${fileName}`,
  formatRejection = defaultFormatRejection,
  error,
  ...fieldProps
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [rejectionMessage, setRejectionMessage] = useState<string>();
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (incoming: File[]) => {
    const { accepted, rejected } = validateFiles(incoming, {
      accept,
      maxSizeBytes,
    });
    setRejectionMessage(
      rejected.length > 0 ? formatRejection(rejected) : undefined,
    );
    if (rejected.length > 0) {
      onReject?.(rejected);
    }
    if (accepted.length > 0) {
      const next = multiple ? [...files, ...accepted] : accepted.slice(0, 1);
      setFiles(next);
      onChange?.(next);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []));
    // Permite volver a elegir el mismo archivo después de quitarlo.
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      addFiles(Array.from(event.dataTransfer.files));
    }
  };

  const removeFile = (index: number) => {
    const next = files.filter((_, fileIndex) => fileIndex !== index);
    setFiles(next);
    onChange?.(next);
  };

  return (
    <Field {...fieldProps} error={error ?? rejectionMessage}>
      {(accessibilityProps) => (
        <div className={styles.wrapper}>
          {/* Arrastrar es un extra del mouse: el teclado usa el <input> de adentro. */}
          <div
            className={cx(
              styles.dropzone,
              isDragging && styles.dragging,
              disabled && styles.disabled,
            )}
            onDragOver={(event) => {
              event.preventDefault();
              if (!disabled) {
                setIsDragging(true);
              }
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              {...accessibilityProps}
              ref={inputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              disabled={disabled}
              className={styles.input}
              onChange={handleInputChange}
            />
            <span className={styles.hint}>{dropHint}</span>
          </div>
          {files.length > 0 && (
            <ul className={styles.list}>
              {files.map((file, index) => (
                <li key={`${index}-${file.name}`} className={styles.item}>
                  <span className={styles.name}>{file.name}</span>
                  <span className={styles.size}>
                    {formatFileSize(file.size)}
                  </span>
                  <CloseButton
                    size="sm"
                    label={formatRemoveLabel(file.name)}
                    onClick={() => removeFile(index)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Field>
  );
};
