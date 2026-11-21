import type { HTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import { getPageItems } from "./pageItems";
import styles from "./Pagination.module.css";

export interface PaginationProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "onChange"
> {
  /** Página actual, empezando en 1. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Cuántas páginas se ven a cada lado de la actual. */
  siblings?: number;
  /** Nombre accesible de la navegación. */
  label?: string;
  previousLabel?: string;
  nextLabel?: string;
  /** Nombre accesible de cada botón numérico. */
  formatPageLabel?: (page: number) => string;
}

const defaultPageLabel = (page: number): string => `Página ${page}`;

/** Paginación numerada (1 2 3 … 10). Para "cargar más" en tandas está `LoadMore`. */
export const Pagination = ({
  page,
  pageCount,
  onPageChange,
  siblings = 1,
  label = "Paginación",
  previousLabel = "Anterior",
  nextLabel = "Siguiente",
  formatPageLabel = defaultPageLabel,
  className,
  ...rest
}: PaginationProps) => {
  if (pageCount <= 1) {
    return null;
  }
  return (
    <nav
      {...rest}
      aria-label={label}
      className={cx(styles.pagination, className)}
    >
      <ul className={styles.list}>
        <li>
          <button
            type="button"
            className={styles.button}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            {previousLabel}
          </button>
        </li>
        {getPageItems(page, pageCount, siblings).map((item) => (
          <li key={item}>
            {typeof item === "number" ? (
              <button
                type="button"
                aria-label={formatPageLabel(item)}
                aria-current={item === page ? "page" : undefined}
                className={cx(styles.button, item === page && styles.current)}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            ) : (
              <span aria-hidden="true" className={styles.ellipsis}>
                …
              </span>
            )}
          </li>
        ))}
        <li>
          <button
            type="button"
            className={styles.button}
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            {nextLabel}
          </button>
        </li>
      </ul>
    </nav>
  );
};
