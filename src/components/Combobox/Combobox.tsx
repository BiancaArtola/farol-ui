import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { cx } from "../../utils/classNames";
import {
  getNextEnabledIndex,
  isListNavigationKey,
} from "../../utils/listNavigation";
import { Field, fieldControlClassName } from "../Field/Field";
import type { FieldOwnProps } from "../Field/fieldProps";
import { filterOptions } from "./filterOptions";
import styles from "./Combobox.module.css";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps extends FieldOwnProps {
  id?: string;
  options: ComboboxOption[];
  /** Valor de la opción elegida, o null si no hay ninguna. */
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Texto cuando lo escrito no coincide con ninguna opción. */
  emptyMessage?: string;
  className?: string;
}

/**
 * Campo de texto con lista de opciones filtrable (patrón ARIA "combobox" con lista). Se
 * escribe para filtrar, se navega con las flechas y se elige con Enter o con un clic; Escape
 * cierra la lista y vuelve al texto de la opción elegida.
 */
export const Combobox = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  emptyMessage = "Sin resultados",
  className,
  ...fieldProps
}: ComboboxProps) => {
  // null = no se está escribiendo: el campo muestra la opción elegida y la lista, todo.
  const [query, setQuery] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedLabel = options.find((option) => option.value === value)?.label;
  const filtered = filterOptions(options, query ?? "");
  // Puede no existir (índice desfasado si cambian las opciones) o estar deshabilitada.
  const activeOption = filtered[activeIndex]?.disabled
    ? undefined
    : filtered[activeIndex];

  const closeList = () => {
    setIsOpen(false);
    setQuery(null);
    setActiveIndex(-1);
  };

  const select = (option: ComboboxOption) => {
    onChange(option.value);
    closeList();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setQuery(text);
    setIsOpen(true);
    setActiveIndex(
      getNextEnabledIndex(filterOptions(options, text), -1, "Home"),
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && isOpen) {
      // No se propaga: si el combobox está dentro de un diálogo, Escape cierra solo la lista.
      event.stopPropagation();
      closeList();
    } else if (event.key === "Enter" && isOpen && activeOption) {
      event.preventDefault();
      select(activeOption);
    } else if (
      (event.key === "ArrowDown" || event.key === "ArrowUp") &&
      isListNavigationKey(event.key)
    ) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex(getNextEnabledIndex(filtered, activeIndex, event.key));
    }
  };

  return (
    <Field {...fieldProps}>
      {(accessibilityProps) => {
        const listId = `${accessibilityProps.id}-list`;
        const optionId = (index: number) =>
          `${accessibilityProps.id}-option-${index}`;
        return (
          <div className={styles.anchor}>
            <input
              {...accessibilityProps}
              type="text"
              role="combobox"
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls={isOpen ? listId : undefined}
              aria-activedescendant={
                isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined
              }
              placeholder={placeholder}
              disabled={disabled}
              value={query ?? selectedLabel ?? ""}
              className={cx(fieldControlClassName, className)}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={closeList}
            />
            {isOpen && filtered.length > 0 && (
              // Mantener el foco en el campo: sin esto, hacer clic en una opción dispara
              // el blur y cierra la lista antes de registrar el clic.
              <ul
                id={listId}
                role="listbox"
                className={styles.list}
                onMouseDown={(event) => event.preventDefault()}
              >
                {filtered.map((option, index) => (
                  // Las flechas y Enter se manejan en el campo (aria-activedescendant); el
                  // clic es el equivalente con mouse.
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                  <li
                    key={option.value}
                    id={optionId(index)}
                    role="option"
                    aria-selected={option.value === value}
                    aria-disabled={option.disabled || undefined}
                    className={cx(
                      styles.option,
                      index === activeIndex && styles.active,
                      option.disabled && styles.disabled,
                    )}
                    onMouseEnter={() =>
                      !option.disabled && setActiveIndex(index)
                    }
                    onClick={() => !option.disabled && select(option)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
            {isOpen && filtered.length === 0 && (
              <p className={styles.empty} role="status">
                {emptyMessage}
              </p>
            )}
          </div>
        );
      }}
    </Field>
  );
};
