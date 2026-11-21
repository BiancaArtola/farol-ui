import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { Alert } from "../components/Alert/Alert";
import { Badge } from "../components/Badge/Badge";
import { Button } from "../components/Button/Button";
import { Card } from "../components/Card/Card";
import { Input } from "../components/Input/Input";
import { Table } from "../components/Table/Table";
import { Tabs } from "../components/Tabs/Tabs";
import {
  editorialTheme,
  farolTheme,
  softTheme,
  technicalTheme,
} from "./presets";

const meta = {
  title: "Theme/Presets",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const PRESETS = [
  { name: "Farol (por defecto)", theme: farolTheme },
  { name: "Editorial sobrio", theme: editorialTheme },
  { name: "Suave y cálido", theme: softTheme },
  { name: "Técnico y denso", theme: technicalTheme },
] as const;

const rows = [
  { id: "1", name: "Lucía Fernández", total: 12400 },
  { id: "2", name: "Mateo Ríos", total: 8950 },
];

const tabs = [
  { id: "summary", label: "Resumen", content: "Contenido del resumen." },
  { id: "activity", label: "Actividad", content: "Contenido de actividad." },
];

// Mismos componentes con cada preset: solo cambian las variables del contenedor. El modo
// claro u oscuro sale del selector de Storybook (la barra de herramientas).
export const Presets: Story = {
  render: () => (
    <div className="story-presets">
      {PRESETS.map(({ name, theme }) => (
        <section
          key={name}
          className="story-preset"
          style={theme as CSSProperties}
          aria-label={name}
        >
          <Card title={name}>
            <div className="story-row">
              <Button>Principal</Button>
              <Button variant="secondary">Secundario</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="story-row">
              <Badge tone="info">Info</Badge>
              <Badge tone="success">Publicado</Badge>
              <Badge>Neutro</Badge>
            </div>
          </Card>
          <Input label="Correo" defaultValue="ana@ejemplo.com" />
          <Alert tone="success" title="Guardado">
            Los cambios ya están publicados.
          </Alert>
          <Tabs label={`Secciones de ${name}`} items={tabs} />
          <Table
            caption="Pedidos recientes"
            columns={[
              { key: "name", header: "Cliente", render: (row) => row.name },
              {
                key: "total",
                header: "Monto",
                numeric: true,
                render: (row) => row.total.toLocaleString("es-AR"),
              },
            ]}
            rows={rows}
            getRowKey={(row) => row.id}
          />
        </section>
      ))}
    </div>
  ),
};
