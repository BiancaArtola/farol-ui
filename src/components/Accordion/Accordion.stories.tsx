import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "./Accordion";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  args: {
    items: [
      {
        id: "envios",
        title: "¿Cuánto tarda un envío?",
        content: "Entre 2 y 4 días hábiles según la zona.",
      },
      {
        id: "pagos",
        title: "¿Qué medios de pago se aceptan?",
        content: "Tarjetas de crédito, débito y transferencia.",
      },
      {
        id: "cambios",
        title: "¿Se pueden hacer cambios?",
        content: "Hasta 30 días después de recibir el pedido.",
      },
    ],
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const VariasAbiertas: Story = {
  args: { allowMultiple: true, defaultOpenIds: ["envios", "pagos"] },
};
