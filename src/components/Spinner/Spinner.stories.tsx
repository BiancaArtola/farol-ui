import type { Meta, StoryObj } from "@storybook/react-vite";
import { SPINNER_SIZES, Spinner } from "./Spinner";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  argTypes: { size: { control: "select", options: SPINNER_SIZES } },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="story-row">
      {SPINNER_SIZES.map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </div>
  ),
};
