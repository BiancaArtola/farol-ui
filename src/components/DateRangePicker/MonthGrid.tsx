import { useMemo, type KeyboardEvent, type RefObject } from "react";
import { cx } from "../../utils/classNames";
import {
  buildMonthGrid,
  isInRange,
  toIsoDate,
  weekdayNames,
  type DateRange,
  type IsoDate,
} from "./dateRange";
import styles from "./DateRangePicker.module.css";

interface MonthGridProps {
  gridRef: RefObject<HTMLTableElement | null>;
  /** Mes y año que se ven; es el nombre accesible de la grilla. */
  title: string;
  viewMonth: Date;
  value: DateRange;
  /** Día que recibe el foco al entrar con Tab. */
  focused: Date;
  todayIso: IsoDate;
  locale: string;
  weekStart: number;
  onPick: (date: Date) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, date: Date) => void;
}

/** La grilla de un mes: solo dibuja; el estado y el foco los maneja `DateRangePicker`. */
export const MonthGrid = ({
  gridRef,
  title,
  viewMonth,
  value,
  focused,
  todayIso,
  locale,
  weekStart,
  onPick,
  onKeyDown,
}: MonthGridProps) => {
  const weekdays = useMemo(
    () => weekdayNames(locale, weekStart),
    [locale, weekStart],
  );
  const dayLabel = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "full" }),
    [locale],
  );
  const weeks = useMemo(
    () =>
      buildMonthGrid(viewMonth.getFullYear(), viewMonth.getMonth(), weekStart),
    [viewMonth, weekStart],
  );
  const focusedIso = toIsoDate(focused);

  const renderDay = (date: Date) => {
    const iso = toIsoDate(date);
    const isOutside = date.getMonth() !== viewMonth.getMonth();
    const isEdge = iso === value.from || iso === value.to;
    const isBetween =
      !isEdge &&
      value.from !== null &&
      value.to !== null &&
      isInRange(iso, value);
    return (
      <td key={iso} role="gridcell" aria-selected={isEdge || isBetween}>
        <button
          type="button"
          data-iso={iso}
          aria-label={dayLabel.format(date)}
          aria-pressed={isEdge}
          tabIndex={iso === focusedIso ? 0 : -1}
          className={cx(
            styles.day,
            isOutside && styles.outside,
            iso === todayIso && styles.today,
            isEdge && styles.edge,
            isBetween && styles.between,
          )}
          onClick={() => onPick(date)}
          onKeyDown={(event) => onKeyDown(event, date)}
        >
          {date.getDate()}
        </button>
      </td>
    );
  };

  return (
    <table ref={gridRef} role="grid" aria-label={title} className={styles.grid}>
      <thead>
        <tr>
          {weekdays.map((day) => (
            <th key={day.long} scope="col" abbr={day.long}>
              {day.short}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week) => (
          <tr key={toIsoDate(week[0]!)}>{week.map(renderDay)}</tr>
        ))}
      </tbody>
    </table>
  );
};
