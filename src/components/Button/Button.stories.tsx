import type { Meta, StoryObj } from "@storybook/react-vite";
import { BUTTON_SIZES, BUTTON_VARIANTS, Button, ButtonLink } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Guardar" },
  argTypes: {
    variant: { control: "select", options: BUTTON_VARIANTS },
    size: { control: "select", options: BUTTON_SIZES },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="story-row">
      {BUTTON_VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="story-row">
      {BUTTON_SIZES.map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

export const Loading: Story = {
  args: { isLoading: true, children: "Guardando" },
};

export const Disabled: Story = { args: { disabled: true } };

// Un enlace con aspecto de botón (navega o descarga).
export const AsLink: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <ButtonLink href="#proyectos">Ver proyectos</ButtonLink>
      <ButtonLink href="#cv" variant="secondary" download>
        Descargar CV
      </ButtonLink>
    </div>
  ),
};
