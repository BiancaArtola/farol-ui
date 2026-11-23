// Tokens y estilos base: se empaquetan en farol-ui.css (import "farol-ui/styles.css").
import "./tokens/tokens.css";

export { ALERT_TONES, Alert } from "./components/Alert/Alert";
export type { AlertProps, AlertTone } from "./components/Alert/Alert";

export { AVATAR_SIZES, Avatar } from "./components/Avatar/Avatar";
export type { AvatarProps, AvatarSize } from "./components/Avatar/Avatar";
export { getInitials } from "./components/Avatar/initials";

export { EmptyState } from "./components/EmptyState/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState/EmptyState";

export { CommandPalette } from "./components/CommandPalette/CommandPalette";
export type {
  Command,
  CommandPaletteProps,
} from "./components/CommandPalette/CommandPalette";

export { Combobox } from "./components/Combobox/Combobox";
export type {
  ComboboxOption,
  ComboboxProps,
} from "./components/Combobox/Combobox";
export {
  filterOptions,
  normalizeSearchText,
} from "./components/Combobox/filterOptions";

export { FileUpload } from "./components/FileUpload/FileUpload";
export type { FileUploadProps } from "./components/FileUpload/FileUpload";
export {
  formatFileSize,
  matchesAccept,
  validateFiles,
} from "./components/FileUpload/fileValidation";
export type {
  FileRejectReason,
  RejectedFile,
} from "./components/FileUpload/fileValidation";

export { Slider } from "./components/Slider/Slider";
export type { SliderProps } from "./components/Slider/Slider";

export { DropdownMenu } from "./components/DropdownMenu/DropdownMenu";
export type {
  DropdownMenuItem,
  DropdownMenuProps,
} from "./components/DropdownMenu/DropdownMenu";

export { POPOVER_PLACEMENTS, Popover } from "./components/Popover/Popover";
export type {
  PopoverPlacement,
  PopoverTrigger,
  PopoverProps,
} from "./components/Popover/Popover";

export { TOOLTIP_PLACEMENTS, Tooltip } from "./components/Tooltip/Tooltip";
export type {
  TooltipPlacement,
  TooltipProps,
} from "./components/Tooltip/Tooltip";

export { LoadMore } from "./components/Pagination/LoadMore";
export type { LoadMoreProps } from "./components/Pagination/LoadMore";

export { Radio } from "./components/Radio/Radio";
export type { RadioProps } from "./components/Radio/Radio";
export { RadioGroup } from "./components/Radio/RadioGroup";
export type {
  RadioGroupProps,
  RadioOption,
} from "./components/Radio/RadioGroup";

export { StatCard } from "./components/StatCard/StatCard";
export type { StatCardProps } from "./components/StatCard/StatCard";

export { Switch } from "./components/Switch/Switch";
export type { SwitchProps } from "./components/Switch/Switch";

export { Table } from "./components/Table/Table";
export type { TableColumn, TableProps } from "./components/Table/Table";
export {
  SORT_DIRECTIONS,
  nextSort,
  sortRows,
} from "./components/Table/sortRows";
export type {
  SortDirection,
  SortValue,
  TableSort,
} from "./components/Table/sortRows";

export { TableToolbar } from "./components/TableToolbar/TableToolbar";
export type { TableToolbarProps } from "./components/TableToolbar/TableToolbar";

export { Textarea } from "./components/Textarea/Textarea";
export type { TextareaProps } from "./components/Textarea/Textarea";

export { Badge, BADGE_TONES } from "./components/Badge/Badge";
export type { BadgeProps, BadgeTone } from "./components/Badge/Badge";

export {
  Button,
  ButtonLink,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  buttonClassName,
} from "./components/Button/Button";
export type {
  ButtonLinkProps,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from "./components/Button/Button";

export { ToastProvider, useToast } from "./components/Toast/Toast";
export type {
  ShowToastOptions,
  ToastProviderProps,
} from "./components/Toast/Toast";
export { TOAST_TONES } from "./components/Toast/toastQueue";
export type { ToastTone } from "./components/Toast/toastQueue";

export { Card } from "./components/Card/Card";
export type { CardHeadingLevel, CardProps } from "./components/Card/Card";

export { DialogProvider, useDialog } from "./components/Dialog/Dialog";
export type {
  ConfirmOptions,
  DialogApi,
  DialogLabels,
  DialogProviderProps,
  PromptOptions,
} from "./components/Dialog/Dialog";

export { Checkbox } from "./components/Checkbox/Checkbox";
export type { CheckboxProps } from "./components/Checkbox/Checkbox";

export { Input } from "./components/Input/Input";
export type { InputProps } from "./components/Input/Input";

export { MODAL_PLACEMENTS, Modal } from "./components/Modal/Modal";
export type { ModalPlacement, ModalProps } from "./components/Modal/Modal";

export { Select } from "./components/Select/Select";
export type { SelectProps } from "./components/Select/Select";

export { Breadcrumbs } from "./components/Breadcrumbs/Breadcrumbs";
export type {
  BreadcrumbItem,
  BreadcrumbsProps,
} from "./components/Breadcrumbs/Breadcrumbs";

export { Navbar } from "./components/Navbar/Navbar";
export type { NavbarProps, NavLinkItem } from "./components/Navbar/Navbar";

export { Pagination } from "./components/Pagination/Pagination";
export type { PaginationProps } from "./components/Pagination/Pagination";
export { getPageItems } from "./components/Pagination/pageItems";
export type { PageItem } from "./components/Pagination/pageItems";

export { Sidebar } from "./components/Sidebar/Sidebar";
export type {
  SidebarProps,
  SidebarSection,
} from "./components/Sidebar/Sidebar";

export { Accordion } from "./components/Accordion/Accordion";
export type {
  AccordionHeadingLevel,
  AccordionItem,
  AccordionProps,
} from "./components/Accordion/Accordion";

export { PROGRESS_TONES, Progress } from "./components/Progress/Progress";
export type {
  ProgressProps,
  ProgressTone,
} from "./components/Progress/Progress";

export { SKELETON_SHAPES, Skeleton } from "./components/Skeleton/Skeleton";
export type {
  SkeletonProps,
  SkeletonShape,
} from "./components/Skeleton/Skeleton";

export { SPINNER_SIZES, Spinner } from "./components/Spinner/Spinner";
export type { SpinnerProps, SpinnerSize } from "./components/Spinner/Spinner";

export { Stepper } from "./components/Stepper/Stepper";
export type {
  StepperProps,
  StepperStatusLabels,
  StepperStep,
} from "./components/Stepper/Stepper";
export { STEP_STATUSES } from "./components/Stepper/stepStatus";
export type { StepStatus } from "./components/Stepper/stepStatus";

export { Timeline } from "./components/Timeline/Timeline";
export type {
  TimelineItem,
  TimelineProps,
} from "./components/Timeline/Timeline";

export { Tabs } from "./components/Tabs/Tabs";
export type { TabItem, TabsProps } from "./components/Tabs/Tabs";

export { ThemeProvider, useTheme } from "./theme/ThemeProvider";
export {
  BUTTON_SHAPES,
  TAB_STYLES,
  THEME_RADII,
  THEME_SHADOWS,
  createTheme,
  themeToCss,
} from "./theme/createTheme";
export type {
  BrandColor,
  ButtonShape,
  NeutralColors,
  TabStyle,
  ThemeNeutrals,
  ThemeOptions,
  ThemeRadius,
  ThemeShadow,
  ThemeVariables,
} from "./theme/createTheme";
export {
  editorialTheme,
  farolTheme,
  softTheme,
  technicalTheme,
  tealTheme,
  violetTheme,
} from "./theme/presets";
export {
  DEFAULT_THEME_STORAGE_KEY,
  THEME_PREFERENCES,
  THEMES,
  getThemeInitScript,
} from "./theme/theme";
export type { Theme, ThemePreference } from "./theme/theme";
