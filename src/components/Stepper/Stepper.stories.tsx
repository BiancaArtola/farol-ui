import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "./Stepper";

const meta = {
  title: "Components/Stepper",
  component: Stepper,
  args: {
    label: "Alta de cuenta",
    currentStep: 1,
    steps: [
      { id: "datos", label: "Datos", description: "Nombre y correo" },
      { id: "pago", label: "Pago", description: "Tarjeta o transferencia" },
      { id: "confirmacion", label: "Confirmación" },
    ],
  },
  argTypes: { currentStep: { control: { type: "number", min: 0, max: 3 } } },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Terminado: Story = { args: { currentStep: 3 } };
