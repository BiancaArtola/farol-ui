import type { HTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import styles from "./Breadcrumbs.module.css";

export interface BreadcrumbItem {
  label: string;
  /** Destino; sin `href`, el elemento es solo texto. El último es siempre la página actual. */
  href?: string;
}

export interface BreadcrumbsProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children"
> {
  items: BreadcrumbItem[];
  /** Nombre accesible de la navegación. */
  label?: string;
}

/** Ruta de navegación ("Inicio / Productos / Zapatillas"): el último ítem es la página actual. */
export const Breadcrumbs = ({
  items,
  label = "Ruta de navegación",
  className,
  ...rest
}: BreadcrumbsProps) => (
  <nav
    {...rest}
    aria-label={label}
    className={cx(styles.breadcrumbs, className)}
  >
    <ol className={styles.list}>
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1;
        return (
          <li key={`${index}-${item.label}`} className={styles.item}>
            {item.href && !isCurrent ? (
              <a href={item.href} className={styles.link}>
                {item.label}
              </a>
            ) : (
              <span
                aria-current={isCurrent ? "page" : undefined}
                className={isCurrent ? styles.current : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
