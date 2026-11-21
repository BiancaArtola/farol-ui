import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { RadioGroup, type RadioGroupProps } from "./RadioGroup";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  args: {
    legend: "Condición frente al IVA",
    value: "monotributo",
    onChange: () => undefined,
    options: [
      { value: "monotributo", label: "Monotributo" },
      { value: "inscripto", label: "Responsable inscripto" },
      { value: "exento", label: "Exento", disabled: true },
    ],
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const ControlledGroup = (props: RadioGroupProps) => {
  const [value, setValue] = useState(props.value);
  return <RadioGroup {...props} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: (args) => <ControlledGroup {...args} />,
};

export const WithHint: Story = {
  args: { hint: "Define el tipo de factura que se emite." },
  render: (args) => <ControlledGroup {...args} />,
};
