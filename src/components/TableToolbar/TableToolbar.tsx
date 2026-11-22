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
  /** Texto de ayuda dentro del buscador; si falta, se usa `searchLabel`. */
  searchPlaceholder?: string;
  /** Ícono decorativo (una lupa) a la izquierda del buscador. */
  searchIcon?: ReactNode;
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
  searchPlaceholder,
  searchIcon,
  className,
}: TableToolbarProps) => (
  <div className={cx(styles.toolbar, className)}>
    <div className={cx(styles.search, Boolean(searchIcon) && styles.withIcon)}>
      {searchIcon && (
        <span className={styles.icon} aria-hidden="true">
          {searchIcon}
        </span>
      )}
      <Input
        type="search"
        label={searchLabel}
        hideLabel
        placeholder={searchPlaceholder ?? searchLabel}
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
