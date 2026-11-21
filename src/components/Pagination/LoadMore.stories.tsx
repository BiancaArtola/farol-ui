import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadMore } from "./LoadMore";

const meta = {
  title: "Components/LoadMore",
  component: LoadMore,
  args: { visible: 100, total: 250, onLoadMore: () => undefined },
} satisfies Meta<typeof LoadMore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Spanish: Story = {
  args: {
    buttonLabel: "Mostrar más",
    formatSummary: (visible, total) => `Mostrando ${visible} de ${total}`,
  },
};
