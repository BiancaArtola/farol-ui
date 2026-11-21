import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { TOOLTIP_PLACEMENTS, Tooltip } from "./Tooltip";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  argTypes: { placement: { control: "select", options: TOOLTIP_PLACEMENTS } },
  args: {
    content: "Guardar los cambios",
    children: <Button>Guardar</Button>,
  },
  decorators: [
    (Story) => (
      <div className="story-spacer">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ubicaciones: Story = {
  render: () => (
    <div className="story-row">
      {TOOLTIP_PLACEMENTS.map((placement) => (
        <Tooltip
          key={placement}
          content={`Ubicación: ${placement}`}
          placement={placement}
        >
          <Button variant="secondary">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
