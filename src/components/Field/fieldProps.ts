// Props que comparten Input, Textarea y Select para su etiqueta, ayuda y error. Vivían
// copiadas en los tres componentes; acá hay una sola definición y una sola forma de separarlas.

import type { ReactNode } from "react";

export interface FieldOwnProps {
  /**
   * La etiqueta es obligatoria: un campo sin nombre no es accesible. Puede ser contenido
   * (por ejemplo texto + "(opcional)" + un ícono de ayuda); lo que se escriba ahí forma el
   * nombre accesible del control.
   */
  label: ReactNode;
  /** Texto de ayuda debajo del control; puede llevar énfasis o un enlace. */
  hint?: ReactNode;
  error?: string;
  /** Oculta la etiqueta visualmente pero la mantiene para lectores de pantalla. */
  hideLabel?: boolean;
}

/**
 * Separa las props del campo (etiqueta, ayuda, error, id) de las del control nativo, para
 * que cada componente solo reenvíe el resto al <input>, <select> o <textarea>.
 */
export const splitFieldProps = <Props extends FieldOwnProps & { id?: string }>(
  props: Props,
) => {
  const { label, hint, error, hideLabel, id, ...controlProps } = props;
  return { fieldProps: { label, hint, error, hideLabel, id }, controlProps };
};
