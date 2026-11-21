import { useId, useState, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/classNames";
import type { HeadingLevel } from "../../utils/headingLevel";
import { toggleOpenIds } from "./accordionState";
import styles from "./Accordion.module.css";

export type AccordionHeadingLevel = HeadingLevel;

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export interface AccordionProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  items: AccordionItem[];
  /** Secciones abiertas al principio. */
  defaultOpenIds?: string[];
  /** Permite tener varias secciones abiertas a la vez. */
  allowMultiple?: boolean;
  /** Nivel de los títulos: elegirlo según el lugar del acordeón en la página. */
  headingLevel?: AccordionHeadingLevel;
}

export const Accordion = ({
  items,
  defaultOpenIds = [],
  allowMultiple = false,
  headingLevel = 3,
  className,
  ...rest
}: AccordionProps) => {
  const baseId = useId();
  const [openIds, setOpenIds] = useState(defaultOpenIds);
  const Heading = `h${headingLevel}` as const;

  return (
    <div {...rest} className={cx(styles.accordion, className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const triggerId = `${baseId}-${item.id}-trigger`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id} className={styles.item}>
            <Heading className={styles.heading}>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={styles.trigger}
                onClick={() =>
                  setOpenIds(toggleOpenIds(openIds, item.id, allowMultiple))
                }
              >
                <span>{item.title}</span>
                <span
                  aria-hidden="true"
                  className={cx(styles.chevron, isOpen && styles.open)}
                />
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className={styles.panel}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};
