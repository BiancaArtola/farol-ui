<p align="right">🇬🇧 English · <a href="README.es.md">🇦🇷 Español</a></p>

# Farol UI

Accessible React components in blue, with light and dark mode. Small, typed and tested.

- **Accessible by default:** labelled fields, keyboard navigation, focus management and visible focus. Color pairs are checked against WCAG AA contrast in both themes by the test suite.
- **Light and dark from one source:** every color is declared once with CSS `light-dark()`. It follows the system theme, or you can force it.
- **No runtime styling library:** CSS Modules and CSS variables. About 3.7 kB of JS and 2 kB of CSS (gzipped).
- **Peer dependencies only:** React 18 or newer.
- **Ready for AI assistants:** the package ships `llms.txt` (`node_modules/farol-ui/llms.txt`), a compact catalog of components, props and common mistakes.

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

| Component                      | What it is for                                                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `Button`                       | Actions. Variants `primary`, `secondary`, `ghost`, `danger`; sizes; `isLoading`.                                                     |
| `Input`                        | Text field with required label, hint and error wired with `aria-describedby`.                                                        |
| `Select`                       | Native select with the same label, hint and error.                                                                                   |
| `Checkbox`                     | Native checkbox with label and hint.                                                                                                 |
| `Card`                         | Container with optional title (choose the heading level), description, tinted icon and footer.                                       |
| `Badge`                        | Status label. Tones `neutral`, `info`, `success`, `warning`, `danger`.                                                               |
| `Modal`                        | Dialog or side panel (`placement="right"`). Escape, focus trap, focus return, scroll lock.                                           |
| `Tabs`                         | Tabs with arrow keys, Home and End, skipping disabled tabs.                                                                          |
| `Table`                        | Accessible data table: numeric columns, sortable headers (`aria-sort`), empty state. Pair it with `sortRows` and `nextSort`.         |
| `TableToolbar`                 | Search box, filters and counter to put above a `Table`.                                                                              |
| `LoadMore`                     | "Showing 100 of 250" footer with a button; renders nothing once everything is visible.                                               |
| `Alert`                        | Message with tones `info`, `success`, `warning`, `danger` (`alert` role for the serious ones).                                       |
| `EmptyState`                   | Title (optionally a heading), icon, description and an action for lists without data.                                                |
| `Textarea`                     | Multi-line field with the same label, hint and error as `Input`.                                                                     |
| `Switch`                       | Native checkbox with `role="switch"`.                                                                                                |
| `RadioGroup`                   | Fieldset with legend and native radios (arrow keys work).                                                                            |
| `Avatar`                       | Initials with the full name as accessible name.                                                                                      |
| `StatCard`                     | Key figure with tinted icon; becomes a button when it has `onClick`, and `isActive` marks the applied filter.                        |
| `ButtonLink`                   | A link (`<a>`) that looks like a `Button`. For Next's `Link`, use `className={buttonClassName()}`.                                   |
| `DialogProvider` / `useDialog` | Replace `confirm()` and `prompt()`: `await confirm({ message })` resolves a boolean, `await prompt({ message })` the text or `null`. |
| `ToastProvider` / `useToast`   | Temporary messages: `showToast({ message, tone })`. Errors use `role="alert"`, the rest `status`; they close on their own.           |
| `Spinner`                      | Loading indicator for a zone (announced as `status`). Buttons already have `isLoading`.                                              |
| `Skeleton`                     | Gray placeholder while content arrives. Decorative: mark the container with `aria-busy`.                                             |
| `Progress`                     | Progress bar with tones; indeterminate when there is no `value`.                                                                     |
| `Accordion`                    | Sections that open and close; one at a time or several (`allowMultiple`).                                                            |
| `Stepper`                      | Steps with state (done, current, pending) also announced to screen readers.                                                          |
| `Timeline`                     | Ordered list of events with a colored marker per tone.                                                                               |
| `Breadcrumbs`                  | Navigation path; the last item is the current page.                                                                                  |
| `Pagination`                   | Numbered pages (1 2 3 … 12) with previous and next. `LoadMore` is the "show more" variant.                                           |
| `Navbar`                       | Top bar with brand, links and actions; links hide behind a menu button on narrow screens.                                            |
| `Sidebar`                      | Vertical navigation grouped in sections.                                                                                             |
| `Tooltip`                      | Short help on hover or focus; Escape hides it.                                                                                       |
| `Popover`                      | Floating panel with free content, opened from a button. Escape or outside click closes it.                                           |
| `DropdownMenu`                 | Action menu: arrows, Home and End to move, Enter to choose, Escape to close.                                                         |
| `CommandPalette`               | Dialog with a search box to run actions by typing.                                                                                   |
| `Slider`                       | Native range input with label, hint, error and visible value.                                                                        |
| `FileUpload`                   | File picker with a drop zone; validates type and size and explains rejections.                                                       |
| `Combobox`                     | Text field with a filterable list (accent-insensitive). For dates use `<Input type="date">`.                                         |

## Theming

### One brand for every component

`createTheme` turns a brand color, a font and a corner style into CSS variables, and `ThemeProvider` applies them to the whole page. Every farol-ui component picks them up, so you set the look once per project:

```tsx
import { ThemeProvider, createTheme } from "farol-ui";

const theme = createTheme({
  primary: "#0e7490", // one hex: it is adjusted to be readable in light and dark
  fontFamily: '"Inter", system-ui, sans-serif',
  radius: "round", // "sharp" | "default" | "round"
});

<ThemeProvider theme={theme}>{/* your app */}</ThemeProvider>;
```

- A single hex is nudged until text and buttons reach WCAG AA (4.5:1) in both themes. To choose both exactly, pass `{ light, dark }`; if that pair is not readable, `createTheme` throws and says which one.
- Without `fontFamily`, components inherit the font of your page. Load the font yourself (for example with `next/font`) and use `font-family: var(--farol-font-family)` in your own CSS to match.
- Brand-only examples: `farolTheme`, `tealTheme`, `violetTheme`.
- On the server, `themeToCss(theme)` returns a `:root { ... }` string you can put in a `<style>` so the first paint already has your brand.

### Complete styles

Beyond the brand color, a theme can change the whole look. These options are all optional and keep today's look when omitted:

```tsx
createTheme({
  primary: { light: "#c2410c", dark: "#ff9a6c" },
  buttonShape: "pill", // "default" | "pill" (also rounds badges)
  uppercaseButtons: false,
  shadow: "soft", // "none" | "soft" (cards, tables, accordions)
  tabs: "pill", // "underline" | "pill" | "block"
  headingFontFamily: '"Fraunces", Georgia, serif',
  neutrals: {
    light: {/* bg, surface, text, muted, border, borderStrong */},
    dark: {/* … */},
  },
});
```

`neutrals` replaces the background, text and border colors (warm, cool, dark…). Every pair that components use together is checked for contrast, and `createTheme` throws if one is not readable. Three finished styles are included: `editorialTheme` (serif titles, thin borders, no shadows), `softTheme` (large corners, pill buttons, warm colors) and `technicalTheme` (monospaced titles, hard borders, uppercase buttons). Fonts are named with system fallbacks; loading them is up to your app. See `Theme/Presets` in Storybook.

### Plain CSS

Colors, spacing, radii and font sizes are CSS variables prefixed with `--farol-`. You can also override them in your own CSS:

```css
:root {
  --farol-color-primary: light-dark(#0f766e, #5eead4);
}
```

Force a theme on the whole page or on one container with `data-theme="light"` or `data-theme="dark"`.

## Development

```bash
npm install
npm run storybook   # component gallery with a light/dark switch at http://localhost:6006 (also published at https://biancaartola.github.io/farol-ui/)
npm run verificar   # lint, typecheck, tests and build
npm run deuda       # duplicated code (jscpd, fails above 3%) and unused code (knip)
```

TypeScript is installed twice on purpose: `typescript` is an alias of TypeScript 6 (the one `typescript-eslint` supports) and `@typescript/native` is TypeScript 7, which provides the `tsc` binary. `eslint-plugin-jsx-a11y` does not declare ESLint 10 support yet, so `package.json` has an `overrides` entry; the tests and lint keep working with it. Remove both when the packages catch up.

## License

MIT
