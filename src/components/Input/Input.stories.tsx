import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input,
  args: { label: "Correo", placeholder: "ana@ejemplo.com" },
  decorators: [
    (Story) => (
      <div className="story-column">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: "Usamos este correo para avisarte" },
};

export const WithError: Story = {
  args: { label: "Clave", type: "password", error: "Mínimo 8 caracteres" },
};

export const Disabled: Story = { args: { disabled: true } };

export const HiddenLabel: Story = {
  args: { label: "Buscar", hideLabel: true, placeholder: "Buscar…" },
};
