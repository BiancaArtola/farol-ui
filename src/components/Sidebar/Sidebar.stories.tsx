import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sidebar } from "./Sidebar";

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  args: {
    sections: [
      {
        id: "general",
        links: [
          {
            id: "resumen",
            label: "Resumen",
            href: "#resumen",
            isCurrent: true,
          },
          { id: "pedidos", label: "Pedidos", href: "#pedidos" },
        ],
      },
      {
        id: "cuenta",
        title: "Cuenta",
        links: [
          { id: "perfil", label: "Perfil", href: "#perfil" },
          { id: "pagos", label: "Pagos", href: "#pagos" },
          { id: "ajustes", label: "Ajustes", href: "#ajustes" },
        ],
      },
    ],
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
