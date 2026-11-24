import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DateRangePicker } from "./DateRangePicker";
import type { DateRange } from "./dateRange";

const meta = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const Controlled = () => {
  const [range, setRange] = useState<DateRange>({ from: null, to: null });
  return (
    <div>
      <DateRangePicker label="Período" value={range} onChange={setRange} />
      <p>
        Elegido: {range.from ?? "—"} → {range.to ?? "—"}
      </p>
    </div>
  );
};

// El primer clic fija el "desde" y el segundo el "hasta"; con el teclado se recorre con las flechas.
export const Default: Story = {
  args: {
    label: "Período",
    value: { from: null, to: null },
    onChange: () => {},
  },
  render: () => <Controlled />,
};
