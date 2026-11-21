// Props que comparten Input, Textarea y Select para su etiqueta, ayuda y error. Vivían
// copiadas en los tres componentes; acá hay una sola definición y una sola forma de separarlas.

export interface FieldOwnProps {
  /** La etiqueta es obligatoria: un campo sin nombre no es accesible. */
  label: string;
  hint?: string;
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
