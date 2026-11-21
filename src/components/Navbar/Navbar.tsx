import { useId, useState, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/classNames";
import styles from "./Navbar.module.css";

export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  /** Marca el enlace de la página actual (aria-current="page"). */
  isCurrent?: boolean;
}

export interface NavbarProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children"
> {
  /** Logo o nombre del sitio, a la izquierda. */
  brand: ReactNode;
  links: NavLinkItem[];
  /** Zona de la derecha, por ejemplo un botón de ingresar o el selector de tema. */
  actions?: ReactNode;
  /** Nombre accesible de la navegación. */
  label?: string;
  /** Texto del botón que abre el menú en pantallas angostas. */
  menuLabel?: string;
}

/** Barra superior: en pantallas angostas los enlaces se esconden tras un botón de menú. */
export const Navbar = ({
  brand,
  links,
  actions,
  label = "Principal",
  menuLabel = "Menú",
  className,
  ...rest
}: NavbarProps) => {
  const menuId = useId();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header {...rest} className={cx(styles.navbar, className)}>
      <div className={styles.brand}>{brand}</div>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen(!isOpen)}
      >
        {menuLabel}
      </button>
      <div id={menuId} className={cx(styles.menu, isOpen && styles.open)}>
        <nav aria-label={label} className={styles.nav}>
          <ul className={styles.list}>
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  aria-current={link.isCurrent ? "page" : undefined}
                  className={styles.link}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </header>
  );
};
