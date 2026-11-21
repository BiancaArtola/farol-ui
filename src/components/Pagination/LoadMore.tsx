import { cx } from "../../utils/classNames";
import { Button } from "../Button/Button";
import styles from "./LoadMore.module.css";

export interface LoadMoreProps {
  /** Cuántos elementos se muestran ahora. */
  visible: number;
  total: number;
  onLoadMore: () => void;
  /** Texto del botón (traducible). */
  buttonLabel?: string;
  /** Texto del contador (traducible). */
  formatSummary?: (visible: number, total: number) => string;
  className?: string;
}

const defaultSummary = (visible: number, total: number): string =>
  `Showing ${visible} of ${total}`;

// Cierre de una lista paginada de a tandas ("Mostrando 100 de 250"). Si ya se ve todo, no
// dibuja nada: no hay nada más que cargar.
export const LoadMore = ({
  visible,
  total,
  onLoadMore,
  buttonLabel = "Show more",
  formatSummary = defaultSummary,
  className,
}: LoadMoreProps) => {
  if (visible >= total) {
    return null;
  }
  return (
    <div className={cx(styles.loadMore, className)}>
      <p className={styles.summary} aria-live="polite">
        {formatSummary(visible, total)}
      </p>
      <Button variant="secondary" size="sm" onClick={onLoadMore}>
        {buttonLabel}
      </Button>
    </div>
  );
};
