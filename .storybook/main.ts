import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  core: { disableTelemetry: true },
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    // El modo librería de vite.config.ts es solo para empaquetar el paquete; Storybook
    // arma su propia app y no debe heredarlo.
    build: { ...viteConfig.build, lib: undefined },
  }),
};

export default config;
