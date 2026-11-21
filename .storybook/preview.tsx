import type { Preview } from "@storybook/react-vite";
import "../src/tokens/tokens.css";
import "./preview.css";

const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "Tema de los componentes",
      toolbar: {
        title: "Tema",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Claro" },
          { value: "dark", title: "Oscuro" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => {
      // data-theme en <html> es lo mismo que hace ThemeProvider en una app real.
      document.documentElement.setAttribute(
        "data-theme",
        context.globals.theme,
      );
      return (
        <div className="story-frame">
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
  },
};

export default preview;
