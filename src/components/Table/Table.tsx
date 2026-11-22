import { Fragment, type ReactNode } from "react";
import { cx } from "../../utils/classNames";
import type { SortDirection, TableSort } from "./sortRows";
import styles from "./Table.module.css";

export interface TableColumn<Row> {
  /** Identifica la columna; es la clave que recibe `onSortChange`. */
  key: string;
  /** Texto o contenido de la cabecera (p. ej. un casillero "seleccionar todos"). */
  header: ReactNode;
  /** Clase extra para la cabecera y las celdas de la columna (ancho, alineación puntual). */
  className?: string;
  /** Cómo se dibuja la celda de esta columna. Se puede omitir si la tabla usa `renderRow`. */
  render?: (row: Row) => ReactNode;
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
  /** Clase extra de cada fila (estado, fila activa). */
  rowClassName?: (row: Row) => string | undefined;
  /** Clic en la fila. Los controles de las celdas (botones, selects) deben detener la propagación. */
  onRowClick?: (row: Row) => void;
  /**
   * Dibuja la fila entera (un `<tr>`), por ejemplo un componente memoizado cuando hay
   * miles de filas con controles. Reemplaza a `columns[].render`, `rowClassName` y
   * `onRowClick`; las celdas deben llevar las mismas clases de columna si se las quiere iguales.
   */
  renderRow?: (row: Row) => ReactNode;
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
  rowClassName,
  onRowClick,
  renderRow,
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
                className={cx(
                  column.numeric && styles.numeric,
                  column.className,
                )}
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
          rows.map((row) =>
            renderRow ? (
              <Fragment key={getRowKey(row)}>{renderRow(row)}</Fragment>
            ) : (
              <tr
                key={getRowKey(row)}
                className={rowClassName?.(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cx(
                      column.numeric && styles.numeric,
                      column.className,
                    )}
                  >
                    {column.render?.(row)}
                  </td>
                ))}
              </tr>
            ),
          )
        )}
      </tbody>
    </table>
  </div>
);
