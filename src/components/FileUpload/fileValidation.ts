// Validación pura de archivos elegidos: tipo (`accept`) y tamaño. Trabaja con la forma
// mínima de un File ({ name, type, size }) para poder probarse sin el navegador.

export interface FileInfo {
  name: string;
  type: string;
  size: number;
}

export type FileRejectReason = "type" | "size";

export interface RejectedFile<File extends FileInfo = FileInfo> {
  file: File;
  reason: FileRejectReason;
}

export interface FileValidationOptions {
  /** Igual que el atributo `accept` de <input type="file">: ".pdf, image/*, application/zip". */
  accept?: string;
  maxSizeBytes?: number;
}

/** ¿El archivo cumple algún criterio de `accept`? Sin `accept`, todo se acepta. */
export const matchesAccept = (file: FileInfo, accept?: string): boolean => {
  const patterns = (accept ?? "")
    .split(",")
    .map((pattern) => pattern.trim().toLowerCase())
    .filter(Boolean);
  if (patterns.length === 0) {
    return true;
  }
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return patterns.some((pattern) => {
    if (pattern.startsWith(".")) {
      return name.endsWith(pattern);
    }
    if (pattern.endsWith("/*")) {
      return type.startsWith(pattern.slice(0, -1));
    }
    return type === pattern;
  });
};

/** Separa los archivos válidos de los rechazados (con el motivo de cada rechazo). */
export const validateFiles = <File extends FileInfo>(
  files: File[],
  { accept, maxSizeBytes }: FileValidationOptions,
): { accepted: File[]; rejected: RejectedFile<File>[] } => {
  const accepted: File[] = [];
  const rejected: RejectedFile<File>[] = [];
  for (const file of files) {
    if (!matchesAccept(file, accept)) {
      rejected.push({ file, reason: "type" });
    } else if (maxSizeBytes !== undefined && file.size > maxSizeBytes) {
      rejected.push({ file, reason: "size" });
    } else {
      accepted.push(file);
    }
  }
  return { accepted, rejected };
};

const SIZE_UNITS = ["B", "KB", "MB", "GB"] as const;

/** Tamaño legible con coma decimal: 512 B, 1,5 KB, 2,0 MB. */
export const formatFileSize = (bytes: number): string => {
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < SIZE_UNITS.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const text =
    unitIndex === 0 ? String(value) : value.toFixed(1).replace(".", ",");
  return `${text} ${SIZE_UNITS[unitIndex]}`;
};
