import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Combobox, type ComboboxProps } from "./Combobox";

const meta = {
  title: "Components/Combobox",
  component: Combobox,
  args: {
    label: "Provincia",
    hint: "Escribir para filtrar la lista",
    value: null,
    onChange: () => undefined,
    options: [
      { value: "cba", label: "Córdoba" },
      { value: "sl", label: "San Luis" },
      { value: "ba", label: "Buenos Aires" },
      { value: "sc", label: "Santa Cruz" },
      { value: "sf", label: "Santa Fe" },
      { value: "mza", label: "Mendoza", disabled: true },
    ],
  },
  decorators: [
    (Story) => (
      <div className="story-column story-spacer">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const Interactive = (props: ComboboxProps) => {
  const [value, setValue] = useState(props.value);
  return <Combobox {...props} value={value} onChange={setValue} />;
};

export const Default: Story = { render: (args) => <Interactive {...args} /> };

export const ConValorInicial: Story = {
  args: { value: "sl" },
  render: (args) => <Interactive {...args} />,
};

export const ConError: Story = {
  args: { error: "Elegir una provincia" },
  render: (args) => <Interactive {...args} />,
};
