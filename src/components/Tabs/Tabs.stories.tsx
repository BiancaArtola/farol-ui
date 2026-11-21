import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./Tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  args: {
    label: "Secciones de ejemplo",
    items: [
      { id: "resumen", label: "Resumen", content: "Contenido del resumen." },
      {
        id: "datos",
        label: "Datos",
        content: "Esta pestaña está bloqueada.",
        disabled: true,
      },
      {
        id: "historial",
        label: "Historial",
        content: "Contenido del historial.",
      },
    ],
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StartingOnAnotherTab: Story = {
  args: { defaultTabId: "historial" },
};
