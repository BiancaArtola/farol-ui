import { Fragment, type ReactNode } from "react";
import { cx } from "../../utils/classNames";
import { ColumnFilter } from "./ColumnFilter";
import type { ColumnFilters } from "./filterRows";
import { FILTER_TYPES, type TableFilterType } from "./filterTypes";
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
  /** Permite filtrar la columna: un campo de texto (ver `filterMode`; requiere `onFilterChange`). */
  filterable?: boolean;
  /** Nombre accesible del filtro; sin esto es "Filtrar" + la cabecera (si es texto) o la clave. */
  filterLabel?: string;
  /**
   * Cómo se escribe el filtro: `"text"` (por defecto) un campo de texto o `"date"` un calendario de
   * rango, que se abre desde un ícono también con `filterMode="row"`. Con `"date"` el valor del
   * filtro es el texto de `serializeDateRange` y `filterRows` lo compara con la fecha de cada fila.
   */
  filterType?: TableFilterType;
}

export type TableFilterMode = "row" | "icon";

export interface TableProps<Row> {
  columns: readonly TableColumn<Row>[];
  rows: readonly Row[];
  getRowKey: (row: Row) => string;
  /** Nombre accesible de la tabla; se oculta visualmente. */
  caption: string;
  /** Orden vigente. La tabla no ordena sola: usar `sortRows` con este valor. */
  sort?: TableSort | null;
  onSortChange?: (key: string) => void;
  /** Texto de cada filtro por columna. La tabla no filtra sola: usar `filterRows` con este valor. */
  filters?: ColumnFilters;
  onFilterChange?: (key: string, value: string) => void;
  /**
   * Dónde se escribe el filtro: `"row"` (por defecto) una fila de campos bajo la cabecera, o
   * `"icon"` un ícono de embudo junto al título de cada columna filtrable que abre un panel chico
   * (ocupa menos y marca con un punto las columnas filtradas).
   */
  filterMode?: TableFilterMode;
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

/** Nombre accesible del filtro de una columna: el `filterLabel` o "Filtrar" + la cabecera. */
const filterLabelOf = <Row,>(column: TableColumn<Row>): string =>
  column.filterLabel ??
  `Filtrar ${typeof column.header === "string" ? column.header : column.key}`;

interface FilterRowProps<Row> {
  columns: readonly TableColumn<Row>[];
  filters: ColumnFilters;
  onFilterChange: (key: string, value: string) => void;
}

/** Segunda fila de la cabecera: un campo de búsqueda bajo cada columna filtrable. */
const FilterRow = <Row,>({
  columns,
  filters,
  onFilterChange,
}: FilterRowProps<Row>) => (
  <tr className={styles.filterRow}>
    {columns.map((column) => (
      <td
        key={column.key}
        className={cx(column.numeric && styles.numeric, column.className)}
      >
        {column.filterable &&
          // Un rango de fechas no se puede escribir en un campo de texto: usa el calendario.
          (column.filterType === FILTER_TYPES.date ? (
            <ColumnFilter
              label={filterLabelOf(column)}
              value={filters[column.key] ?? ""}
              type={FILTER_TYPES.date}
              onChange={(value) => onFilterChange(column.key, value)}
            />
          ) : (
            <input
              type="search"
              className={styles.filterInput}
              aria-label={filterLabelOf(column)}
              value={filters[column.key] ?? ""}
              onChange={(event) =>
                onFilterChange(column.key, event.target.value)
              }
            />
          ))}
      </td>
    ))}
  </tr>
);

interface HeaderCellProps<Row> {
  column: TableColumn<Row>;
  sort: TableSort | null;
  onSortChange?: (key: string) => void;
  filters: ColumnFilters;
  /** Si llega, la columna filtrable muestra su ícono de filtro junto al título. */
  onFilterChange?: (key: string, value: string) => void;
}

/** Cabecera de una columna: el título (o su botón de orden) y, si corresponde, el filtro. */
const HeaderCell = <Row,>({
  column,
  sort,
  onSortChange,
  filters,
  onFilterChange,
}: HeaderCellProps<Row>) => {
  const direction = sort?.key === column.key ? sort.direction : null;
  const isSortable = column.sortable && onSortChange;
  const ariaSort = direction ? ARIA_SORT[direction] : "none";
  const title = isSortable ? (
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
  );
  return (
    <th
      scope="col"
      className={cx(column.numeric && styles.numeric, column.className)}
      aria-sort={isSortable ? ariaSort : undefined}
    >
      {onFilterChange && column.filterable ? (
        <span className={styles.headerContent}>
          {title}
          <ColumnFilter
            label={filterLabelOf(column)}
            value={filters[column.key] ?? ""}
            type={column.filterType}
            onChange={(value) => onFilterChange(column.key, value)}
          />
        </span>
      ) : (
        title
      )}
    </th>
  );
};

export const Table = <Row,>({
  columns,
  rows,
  getRowKey,
  caption,
  sort = null,
  onSortChange,
  filters = {},
  onFilterChange,
  filterMode = "row",
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
          {columns.map((column) => (
            <HeaderCell
              key={column.key}
              column={column}
              sort={sort}
              onSortChange={onSortChange}
              filters={filters}
              // En modo fila el filtro va en `FilterRow`, no en la cabecera.
              onFilterChange={
                filterMode === "icon" ? onFilterChange : undefined
              }
            />
          ))}
        </tr>
        {filterMode === "row" &&
          onFilterChange &&
          columns.some((column) => column.filterable) && (
            <FilterRow
              columns={columns}
              filters={filters}
              onFilterChange={onFilterChange}
            />
          )}
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
