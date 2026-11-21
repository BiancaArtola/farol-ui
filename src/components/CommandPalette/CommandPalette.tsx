import { useEffect, useState, useId, type KeyboardEvent } from "react";
import { cx } from "../../utils/classNames";
import {
  getNextEnabledIndex,
  isListNavigationKey,
} from "../../utils/listNavigation";
import { filterOptions } from "../Combobox/filterOptions";
import { Input } from "../Input/Input";
import { Modal } from "../Modal/Modal";
import styles from "./CommandPalette.module.css";

export interface Command {
  id: string;
  label: string;
  /** Texto de apoyo a la derecha, por ejemplo un atajo ("Ctrl K") o la sección. */
  hint?: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: Command[];
  /** Título del diálogo (también su nombre accesible). */
  title?: string;
  /** Etiqueta del buscador, visible solo para lectores de pantalla. */
  searchLabel?: string;
  placeholder?: string;
  /** Texto cuando lo escrito no coincide con ningún comando. */
  emptyMessage?: string;
  closeLabel?: string;
}

interface PaletteBodyProps extends Required<
  Pick<
    CommandPaletteProps,
    "commands" | "searchLabel" | "emptyMessage" | "onClose"
  >
> {
  placeholder?: string;
}

// Vive dentro del Modal, que desmonta sus hijos al cerrar: así cada vez que se abre la
// paleta arranca con el buscador vacío y sin selección.
const PaletteBody = ({
  commands,
  searchLabel,
  placeholder,
  emptyMessage,
  onClose,
}: PaletteBodyProps) => {
  const baseId = useId();
  const listId = `${baseId}-list`;
  const optionId = (index: number) => `${baseId}-option-${index}`;
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = filterOptions(commands, query);
  const activeCommand = filtered[activeIndex];

  useEffect(() => {
    // Mantiene a la vista el comando activo cuando la lista tiene scroll.
    document
      .getElementById(optionId(activeIndex))
      ?.scrollIntoView?.({ block: "nearest" });
    // optionId depende solo de baseId, que no cambia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, query]);

  const run = (command: Command) => {
    onClose();
    command.onSelect();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && activeCommand && !activeCommand.disabled) {
      event.preventDefault();
      run(activeCommand);
    } else if (
      isListNavigationKey(event.key) &&
      event.key.startsWith("Arrow")
    ) {
      event.preventDefault();
      setActiveIndex(getNextEnabledIndex(filtered, activeIndex, event.key));
    }
  };

  return (
    <div className={styles.palette}>
      <Input
        label={searchLabel}
        hideLabel
        placeholder={placeholder}
        value={query}
        data-autofocus
        role="combobox"
        autoComplete="off"
        aria-expanded="true"
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          activeCommand ? optionId(activeIndex) : undefined
        }
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(
            getNextEnabledIndex(
              filterOptions(commands, event.target.value),
              -1,
              "Home",
            ),
          );
        }}
        onKeyDown={handleKeyDown}
      />
      {filtered.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={searchLabel}
          className={styles.list}
        >
          {filtered.map((command, index) => (
            // Las flechas y Enter se manejan en el buscador (aria-activedescendant); el clic
            // es el equivalente con mouse.
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <li
              key={command.id}
              id={optionId(index)}
              role="option"
              aria-selected={index === activeIndex}
              aria-disabled={command.disabled || undefined}
              className={cx(
                styles.option,
                index === activeIndex && styles.active,
                command.disabled && styles.disabled,
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => !command.disabled && run(command)}
            >
              <span>{command.label}</span>
              {command.hint && (
                <span className={styles.hint}>{command.hint}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty} role="status">
          {emptyMessage}
        </p>
      )}
    </div>
  );
};

/**
 * Paleta de comandos: un diálogo con buscador para ejecutar acciones escribiendo ("Ir a
 * pedidos", "Cambiar tema"). Abrirla con un atajo de teclado es cosa de la aplicación.
 */
export const CommandPalette = ({
  open,
  onClose,
  commands,
  title = "Buscar comando",
  searchLabel = "Buscar comando",
  placeholder = "Escribir para buscar…",
  emptyMessage = "Sin resultados",
  closeLabel,
}: CommandPaletteProps) => (
  <Modal open={open} onClose={onClose} title={title} closeLabel={closeLabel}>
    <PaletteBody
      commands={commands}
      searchLabel={searchLabel}
      placeholder={placeholder}
      emptyMessage={emptyMessage}
      onClose={onClose}
    />
  </Modal>
);
