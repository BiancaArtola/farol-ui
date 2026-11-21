import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { DropdownMenu } from "./DropdownMenu";

const noop = () => undefined;

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  args: {
    label: "Acciones del pedido",
    trigger: <Button variant="secondary">Acciones</Button>,
    items: [
      { id: "editar", label: "Editar", onSelect: noop },
      { id: "duplicar", label: "Duplicar", onSelect: noop, disabled: true },
      { id: "archivar", label: "Archivar", onSelect: noop },
      { id: "eliminar", label: "Eliminar", onSelect: noop, tone: "danger" },
    ],
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="story-spacer">
        <Story />
      </div>
    ),
  ],
};

export const AlineadoALaDerecha: Story = {
  args: { placement: "bottom-end" },
  decorators: Default.decorators,
};
