import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../Button/Button";
import { CommandPalette, type CommandPaletteProps } from "./CommandPalette";

const noop = () => undefined;

const meta = {
  title: "Components/CommandPalette",
  component: CommandPalette,
  args: {
    open: false,
    onClose: noop,
    commands: [
      { id: "pedidos", label: "Ir a pedidos", hint: "G P", onSelect: noop },
      { id: "clientes", label: "Ir a clientes", hint: "G C", onSelect: noop },
      { id: "tema", label: "Cambiar tema", onSelect: noop },
      { id: "perfil", label: "Editar perfil", onSelect: noop },
      { id: "salir", label: "Cerrar sesión", onSelect: noop, disabled: true },
    ],
  },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

const Demo = (props: CommandPaletteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Abrir la paleta</Button>
      <CommandPalette
        {...props}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export const Default: Story = { render: (args) => <Demo {...args} /> };
