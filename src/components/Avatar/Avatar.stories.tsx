import type { Meta, StoryObj } from "@storybook/react-vite";
import { AVATAR_SIZES, Avatar } from "./Avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  argTypes: { size: { control: "select", options: AVATAR_SIZES } },
  args: { name: "Juan Pérez" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = { args: { size: "lg", name: "María Gómez" } };
