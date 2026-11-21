import { useId, type HTMLAttributes } from "react";
import { cx } from "../../utils/classNames";
import type { NavLinkItem } from "../Navbar/Navbar";
import styles from "./Sidebar.module.css";

export interface SidebarSection {
  id: string;
  /** Título del grupo; sin título, los enlaces van sin encabezado. */
  title?: string;
  links: NavLinkItem[];
}

export interface SidebarProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children"
> {
  sections: SidebarSection[];
  /** Nombre accesible de la navegación. */
  label?: string;
}

/** Navegación vertical agrupada por secciones, para paneles y documentación. */
export const Sidebar = ({
  sections,
  label = "Secciones",
  className,
  ...rest
}: SidebarProps) => {
  const baseId = useId();

  return (
    <nav {...rest} aria-label={label} className={cx(styles.sidebar, className)}>
      {sections.map((section) => {
        const titleId = `${baseId}-${section.id}`;
        return (
          <div key={section.id} className={styles.section}>
            {section.title && (
              <p id={titleId} className={styles.title}>
                {section.title}
              </p>
            )}
            <ul
              aria-labelledby={section.title ? titleId : undefined}
              className={styles.list}
            >
              {section.links.map((link) => (
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
          </div>
        );
      })}
    </nav>
  );
};
