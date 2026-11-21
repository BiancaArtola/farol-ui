import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState, type CSSProperties } from "react";
import { Alert } from "../components/Alert/Alert";
import { Badge } from "../components/Badge/Badge";
import { Button } from "../components/Button/Button";
import { Card } from "../components/Card/Card";
import { Input } from "../components/Input/Input";
import { Switch } from "../components/Switch/Switch";
import { Table } from "../components/Table/Table";
import { THEME_RADII, createTheme, type ThemeRadius } from "./createTheme";

const FONTS = {
  "Heredar de la página": undefined,
  Sistema: "system-ui, sans-serif",
  Serif: "Georgia, serif",
  Monoespaciada: "ui-monospace, Consolas, monospace",
} as const;

const meta = {
  title: "Theme/Playground",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { id: "1", name: "Juan Pérez", total: 120000 },
  { id: "2", name: "María Gómez", total: 35050 },
];

// Prueba en vivo de createTheme: el color, la fuente y el redondeo se aplican solo a este
// contenedor (con style), así que no cambian el resto de Storybook.
const Playground = () => {
  const [primary, setPrimary] = useState("#0e7490");
  const [fontName, setFontName] = useState<keyof typeof FONTS>(
    "Heredar de la página",
  );
  const [radius, setRadius] = useState<ThemeRadius>("default");

  const variables = useMemo(
    () => createTheme({ primary, fontFamily: FONTS[fontName], radius }),
    [primary, fontName, radius],
  );

  return (
    <div style={variables as CSSProperties}>
      <div className="story-row story-row-spaced">
        <label>
          Color de marca{" "}
          <input
            type="color"
            value={primary}
            onChange={(event) => setPrimary(event.target.value)}
          />
        </label>
        <label>
          Tipografía{" "}
          <select
            value={fontName}
            onChange={(event) =>
              setFontName(event.target.value as keyof typeof FONTS)
            }
          >
            {Object.keys(FONTS).map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
        <label>
          Esquinas{" "}
          <select
            value={radius}
            onChange={(event) => setRadius(event.target.value as ThemeRadius)}
          >
            {THEME_RADII.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="story-grid">
        <Card title="Todos los componentes comparten la marca">
          <div className="story-row">
            <Button>Principal</Button>
            <Button variant="secondary">Secundario</Button>
            <Badge tone="info">Info</Badge>
          </div>
        </Card>
        <Input label="Nombre" defaultValue="Ana Pérez" />
        <Switch label="Avisos por mail" defaultChecked />
        <Alert title="Atención" tone="warning">
          Revisar los datos antes de emitir.
        </Alert>
        <Table
          caption="Comprobantes"
          columns={[
            { key: "name", header: "Cliente", render: (row) => row.name },
            {
              key: "total",
              header: "Total",
              numeric: true,
              render: (row) => row.total.toLocaleString("es-AR"),
            },
          ]}
          rows={rows}
          getRowKey={(row) => row.id}
        />
      </div>
    </div>
  );
};

export const Playground_: Story = {
  name: "Playground",
  render: () => <Playground />,
};
