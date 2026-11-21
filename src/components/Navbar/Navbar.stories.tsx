import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { Navbar } from "./Navbar";

const meta = {
  title: "Components/Navbar",
  component: Navbar,
  parameters: { layout: "fullscreen" },
  args: {
    brand: "Farol",
    links: [
      { id: "inicio", label: "Inicio", href: "#inicio", isCurrent: true },
      { id: "proyectos", label: "Proyectos", href: "#proyectos" },
      { id: "contacto", label: "Contacto", href: "#contacto" },
    ],
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ConAcciones: Story = {
  args: { actions: <Button size="sm">Ingresar</Button> },
};
