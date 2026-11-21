import type { ReactNode } from "react";
import { cx } from "../../utils/classNames";
import { Input } from "../Input/Input";
import styles from "./TableToolbar.module.css";

export interface TableToolbarProps {
  searchLabel: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  /** Filtros (por ejemplo Badge o Button) entre el buscador y el contador. */
  filters?: ReactNode;
  /** Texto del contador, por ejemplo "12 comprobantes". */
  summary?: string;
  className?: string;
}

// Barra sobre una Table: buscador, filtros y contador. El filtrado en sí lo hace quien
// usa el componente; esto solo ordena la interfaz.
export const TableToolbar = ({
  searchLabel,
  searchValue,
  onSearchChange,
  filters,
  summary,
  className,
}: TableToolbarProps) => (
  <div className={cx(styles.toolbar, className)}>
    <div className={styles.search}>
      <Input
        type="search"
        label={searchLabel}
        hideLabel
        placeholder={searchLabel}
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </div>
    {filters && <div className={styles.filters}>{filters}</div>}
    {summary && (
      <p className={styles.summary} aria-live="polite">
        {summary}
      </p>
    )}
  </div>
);
