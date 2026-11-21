import type { ReactNode } from "react";
import { cx } from "../../utils/classNames";
import type { SortDirection, TableSort } from "./sortRows";
import styles from "./Table.module.css";

export interface TableColumn<Row> {
  /** Identifica la columna; es la clave que recibe `onSortChange`. */
  key: string;
  header: string;
  /** Cómo se dibuja la celda de esta columna. */
  render: (row: Row) => ReactNode;
  /** Importes y cantidades: se alinean a la derecha. */
  numeric?: boolean;
  /** La cabecera pasa a ser un botón que ordena (requiere `onSortChange`). */
  sortable?: boolean;
}

export interface TableProps<Row> {
  columns: readonly TableColumn<Row>[];
  rows: readonly Row[];
  getRowKey: (row: Row) => string;
  /** Nombre accesible de la tabla; se oculta visualmente. */
  caption: string;
  /** Orden vigente. La tabla no ordena sola: usar `sortRows` con este valor. */
  sort?: TableSort | null;
  onSortChange?: (key: string) => void;
  /** Texto cuando no hay filas. */
  emptyMessage?: string;
  className?: string;
}

const ARIA_SORT: Record<SortDirection, "ascending" | "descending"> = {
  asc: "ascending",
  desc: "descending",
};
const ARROWS: Record<SortDirection, string> = { asc: "▲", desc: "▼" };

export const Table = <Row,>({
  columns,
  rows,
  getRowKey,
  caption,
  sort = null,
  onSortChange,
  emptyMessage = "No data",
  className,
}: TableProps<Row>) => (
  <div className={cx(styles.wrapper, className)}>
    <table className={styles.table}>
      <caption className={styles.caption}>{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => {
            const direction = sort?.key === column.key ? sort.direction : null;
            const isSortable = column.sortable && onSortChange;
            const ariaSort = direction ? ARIA_SORT[direction] : "none";
            return (
              <th
                key={column.key}
                scope="col"
                className={cx(styles.cell, column.numeric && styles.numeric)}
                aria-sort={isSortable ? ariaSort : undefined}
              >
                {isSortable ? (
                  <button
                    type="button"
                    className={styles.sortButton}
                    onClick={() => onSortChange(column.key)}
                  >
                    {column.header}
                    <span aria-hidden="true" className={styles.arrow}>
                      {direction ? ARROWS[direction] : "↕"}
                    </span>
                  </button>
                ) : (
                  column.header
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className={styles.empty}>
              {emptyMessage}
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cx(styles.cell, column.numeric && styles.numeric)}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
