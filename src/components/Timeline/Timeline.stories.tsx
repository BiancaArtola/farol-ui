import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline } from "./Timeline";

const meta = {
  title: "Components/Timeline",
  component: Timeline,
  args: {
    label: "Seguimiento del pedido",
    items: [
      {
        id: "pedido",
        title: "Pedido recibido",
        time: "12 nov, 10:30",
        tone: "info",
      },
      {
        id: "envio",
        title: "Pedido enviado",
        time: "13 nov, 09:00",
        description: "Salió del depósito con el correo.",
        tone: "success",
      },
      {
        id: "demora",
        title: "Demora en la zona",
        time: "14 nov, 16:45",
        tone: "warning",
      },
      { id: "entrega", title: "Entrega pendiente" },
    ],
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
