// Tokens y estilos base: se empaquetan en farol-ui.css (import "farol-ui/styles.css").
import "./tokens/tokens.css";

export { Badge, BADGE_TONES } from "./components/Badge/Badge";
export type { BadgeProps, BadgeTone } from "./components/Badge/Badge";

export {
  Button,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
} from "./components/Button/Button";
export type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from "./components/Button/Button";

export { Card } from "./components/Card/Card";
export type { CardHeadingLevel, CardProps } from "./components/Card/Card";

export { Checkbox } from "./components/Checkbox/Checkbox";
export type { CheckboxProps } from "./components/Checkbox/Checkbox";

export { Input } from "./components/Input/Input";
export type { InputProps } from "./components/Input/Input";

export { MODAL_PLACEMENTS, Modal } from "./components/Modal/Modal";
export type { ModalPlacement, ModalProps } from "./components/Modal/Modal";

export { Select } from "./components/Select/Select";
export type { SelectProps } from "./components/Select/Select";

export { Tabs } from "./components/Tabs/Tabs";
export type { TabItem, TabsProps } from "./components/Tabs/Tabs";

export { ThemeProvider, useTheme } from "./theme/ThemeProvider";
export {
  DEFAULT_THEME_STORAGE_KEY,
  THEME_PREFERENCES,
  THEMES,
  getThemeInitScript,
} from "./theme/theme";
export type { Theme, ThemePreference } from "./theme/theme";
