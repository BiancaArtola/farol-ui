import type { Meta, StoryObj } from "@storybook/react-vite";
import { BADGE_TONES, Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: { children: "Listo" },
  argTypes: { tone: { control: "select", options: BADGE_TONES } },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="story-row">
      {BADGE_TONES.map((tone) => (
        <Badge key={tone} tone={tone}>
          {tone}
        </Badge>
      ))}
    </div>
  ),
};
