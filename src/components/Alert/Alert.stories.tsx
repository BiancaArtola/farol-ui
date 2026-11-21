import type { Meta, StoryObj } from "@storybook/react-vite";
import { ALERT_TONES, Alert } from "./Alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  argTypes: { tone: { control: "select", options: ALERT_TONES } },
  args: { children: "Los cambios se guardan solos." },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = { args: { tone: "success", title: "Listo" } };

export const Warning: Story = {
  args: {
    tone: "warning",
    title: "Revisar",
    children: "Faltan datos del receptor.",
  },
};

export const Danger: Story = {
  args: { tone: "danger", children: "No se pudo cargar el lote." },
};
