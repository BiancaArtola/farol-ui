import type { Meta, StoryObj } from "@storybook/react-vite";
import { PROGRESS_TONES, Progress } from "./Progress";

const meta = {
  title: "Components/Progress",
  component: Progress,
  args: { label: "Importación", value: 60, showValue: true },
  argTypes: { tone: { control: "select", options: PROGRESS_TONES } },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="story-column">
      {PROGRESS_TONES.map((tone) => (
        <Progress key={tone} label={tone} value={70} tone={tone} showValue />
      ))}
    </div>
  ),
};

export const Indeterminate: Story = {
  args: { label: "Procesando", value: undefined },
};
