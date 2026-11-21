import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { MODAL_PLACEMENTS, Modal, type ModalProps } from "./Modal";

const meta = {
  title: "Components/Modal",
  component: Modal,
  argTypes: { placement: { control: "select", options: MODAL_PLACEMENTS } },
  args: {
    open: false,
    title: "Eliminar emisor",
    onClose: () => undefined,
    children: "Se borrarán también sus cobros y su historial.",
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// El estado de apertura vive en la historia: así se prueba abrir, cerrar con Escape,
// con el fondo o con el botón, y que el foco vuelva al botón que lo abrió.
const OpenableModal = (props: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Abrir</Button>
      <Modal {...props} open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export const Dialog: Story = {
  render: (args) => (
    <OpenableModal
      {...args}
      footer={
        <>
          <Button variant="ghost">Cancelar</Button>
          <Button variant="danger">Eliminar</Button>
        </>
      }
    />
  ),
};

export const SidePanel: Story = {
  args: { placement: "right", title: "Detalle del emisor" },
  render: (args) => (
    <OpenableModal {...args}>
      <Input label="Nombre" defaultValue="Ana Pérez" />
    </OpenableModal>
  ),
};
