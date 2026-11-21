import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { ToastProvider, useToast } from "./Toast";
import { TOAST_TONES } from "./toastQueue";

const meta = {
  title: "Components/Toast",
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Buttons = () => {
  const { showToast } = useToast();
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {TOAST_TONES.map((tone) => (
        <Button
          key={tone}
          variant="secondary"
          onClick={() => showToast({ tone, message: `Aviso de tipo ${tone}` })}
        >
          {tone}
        </Button>
      ))}
      <Button
        variant="ghost"
        onClick={() =>
          showToast({ message: "Se queda hasta cerrarlo", duration: 0 })
        }
      >
        Sin cierre automático
      </Button>
    </div>
  );
};

export const Default: Story = { render: () => <Buttons /> };
