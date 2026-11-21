import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileUpload } from "./FileUpload";

const meta = {
  title: "Components/FileUpload",
  component: FileUpload,
  args: { label: "Currículum", hint: "PDF de hasta 2 MB" },
  decorators: [
    (Story) => (
      <div className="story-column">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { accept: ".pdf", maxSizeBytes: 2 * 1024 * 1024 },
};

export const VariosArchivos: Story = {
  args: { label: "Fotos", accept: "image/*", multiple: true, hint: undefined },
};

export const Deshabilitado: Story = { args: { disabled: true } };
