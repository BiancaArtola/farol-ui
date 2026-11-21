import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumbs } from "./Breadcrumbs";

const meta = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
  args: {
    items: [
      { label: "Inicio", href: "#inicio" },
      { label: "Productos", href: "#productos" },
      { label: "Calzado", href: "#calzado" },
      { label: "Zapatillas" },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
