import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { width: 240 } };

export const CardPlaceholder: Story = {
  render: () => (
    <div className="story-column" aria-busy="true">
      <div className="story-row">
        <Skeleton shape="circle" />
        <Skeleton width={160} />
      </div>
      <Skeleton shape="rect" />
      <Skeleton width="80%" />
      <Skeleton width="60%" />
    </div>
  ),
};
