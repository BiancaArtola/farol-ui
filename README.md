<p align="right">🇬🇧 English · <a href="README.es.md">🇦🇷 Español</a></p>

# Farol UI

Accessible React components in blue, with light and dark mode. Small, typed and tested.

- **Accessible by default:** labelled fields, keyboard navigation, focus management and visible focus. Color pairs are checked against WCAG AA contrast in both themes by the test suite.
- **Light and dark from one source:** every color is declared once with CSS `light-dark()`. It follows the system theme, or you can force it.
- **No runtime styling library:** CSS Modules and CSS variables. About 3.7 kB of JS and 2 kB of CSS (gzipped).
- **Peer dependencies only:** React 18 or newer.

## Install

```bash
npm install farol-ui
```

## Use

Import the styles once, and wrap your app in `ThemeProvider` if you want the theme switch.

```tsx
import "farol-ui/styles.css";
import { Button, Card, Input, ThemeProvider, useTheme } from "farol-ui";

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button variant="ghost" onClick={toggleTheme}>
      Theme: {theme}
    </Button>
  );
};

export const App = () => (
  <ThemeProvider>
    <Card title="Sign in">
      <Input label="Email" type="email" />
      <Button>Continue</Button>
      <ThemeButton />
    </Card>
  </ThemeProvider>
);
```

### Avoiding a flash of the wrong theme

With server rendering, add this script to the `<head>` so the saved theme is applied before the first paint:

```tsx
import { getThemeInitScript } from "farol-ui";

<script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />;
```

## Components

| Component  | What it is for                                                                             |
| ---------- | ------------------------------------------------------------------------------------------ |
| `Button`   | Actions. Variants `primary`, `secondary`, `ghost`, `danger`; sizes; `isLoading`.           |
| `Input`    | Text field with required label, hint and error wired with `aria-describedby`.              |
| `Select`   | Native select with the same label, hint and error.                                         |
| `Checkbox` | Native checkbox with label and hint.                                                       |
| `Card`     | Container with optional title (choose the heading level) and footer.                       |
| `Badge`    | Status label. Tones `neutral`, `info`, `success`, `warning`, `danger`.                     |
| `Modal`    | Dialog or side panel (`placement="right"`). Escape, focus trap, focus return, scroll lock. |
| `Tabs`     | Tabs with arrow keys, Home and End, skipping disabled tabs.                                |

## Theming

Colors, spacing, radii and font sizes are CSS variables prefixed with `--farol-`. Override them in your own CSS:

```css
:root {
  --farol-color-primary: light-dark(#0f766e, #5eead4);
}
```

Force a theme on the whole page or on one container with `data-theme="light"` or `data-theme="dark"`.

## Development

```bash
npm install
npm run demo        # component gallery at http://localhost:5199
npm run verificar   # lint, typecheck, tests and build
```

## License

MIT
