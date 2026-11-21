import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { Card } from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  args: {
    title: "Resumen",
    children: "Una tarjeta con título, contenido y pie de acciones.",
  },
  decorators: [
    (Story) => (
      <div className="story-column">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFooter: Story = {
  args: { footer: <Button size="sm">Ver detalle</Button> },
};

export const WithoutTitle: Story = { args: { title: undefined } };
