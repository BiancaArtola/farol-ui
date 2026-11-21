import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { Checkbox } from "../Checkbox/Checkbox";
import { POPOVER_PLACEMENTS, Popover } from "./Popover";

const meta = {
  title: "Components/Popover",
  component: Popover,
  argTypes: { placement: { control: "select", options: POPOVER_PLACEMENTS } },
  args: {
    label: "Filtros de la lista",
    trigger: <Button variant="secondary">Filtros</Button>,
    children: (
      <div className="story-column">
        <Checkbox label="Solo pendientes" />
        <Checkbox label="Con adjuntos" />
      </div>
    ),
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AbreHaciaArriba: Story = {
  args: { placement: "top-start" },
  decorators: [
    (Story) => (
      <div className="story-spacer">
        <Story />
      </div>
    ),
  ],
};
