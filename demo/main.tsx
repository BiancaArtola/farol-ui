import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Badge,
  BADGE_TONES,
  Button,
  BUTTON_VARIANTS,
  Card,
  Checkbox,
  Input,
  Modal,
  Select,
  Tabs,
  ThemeProvider,
  useTheme,
} from "../src";
import "./demo.css";

const ThemeSwitch = () => {
  const { preference, theme, setPreference, toggleTheme } = useTheme();
  return (
    <div className="demo-row">
      <Button variant="secondary" onClick={toggleTheme}>
        Tema: {theme}
      </Button>
      <Button variant="ghost" onClick={() => setPreference("system")}>
        Usar el del sistema {preference === "system" ? "(activo)" : ""}
      </Button>
    </div>
  );
};

const Demo = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <main className="demo">
      <header>
        <h1>Farol UI</h1>
        <p>Componentes accesibles en azul, con modo claro y oscuro.</p>
        <ThemeSwitch />
      </header>

      <section>
        <h2>Button</h2>
        <div className="demo-row">
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
          <Button isLoading>Guardando</Button>
          <Button disabled>Deshabilitado</Button>
        </div>
        <div className="demo-row">
          <Button size="sm">Chico</Button>
          <Button size="md">Mediano</Button>
          <Button size="lg">Grande</Button>
        </div>
      </section>

      <section>
        <h2>Badge</h2>
        <div className="demo-row">
          {BADGE_TONES.map((tone) => (
            <Badge key={tone} tone={tone}>
              {tone}
            </Badge>
          ))}
        </div>
      </section>

      <section>
        <h2>Campos</h2>
        <div className="demo-grid">
          <Input label="Nombre" placeholder="Ana Pérez" />
          <Input
            label="Correo"
            hint="Usamos este correo para avisarte"
            defaultValue="ana"
          />
          <Input label="Clave" type="password" error="Mínimo 8 caracteres" />
          <Select label="Moneda" hint="Se usa para los totales">
            <option value="ARS">Pesos</option>
            <option value="USD">Dólares</option>
          </Select>
          <Checkbox label="Recordarme" hint="En este equipo" defaultChecked />
        </div>
      </section>

      <section>
        <h2>Card</h2>
        <div className="demo-grid">
          <Card title="Resumen" footer={<Button size="sm">Ver detalle</Button>}>
            Una tarjeta con título, contenido y pie de acciones.
          </Card>
          <Card title="Sin pie">Solo título y contenido.</Card>
        </div>
      </section>

      <section>
        <h2>Tabs</h2>
        <Tabs
          label="Secciones de ejemplo"
          items={[
            { id: "uno", label: "Resumen", content: "Contenido del resumen." },
            {
              id: "dos",
              label: "Datos",
              content: "Esta pestaña está bloqueada.",
              disabled: true,
            },
            {
              id: "tres",
              label: "Historial",
              content: "Contenido del historial.",
            },
          ]}
        />
      </section>

      <section>
        <h2>Modal y panel lateral</h2>
        <div className="demo-row">
          <Button onClick={() => setIsDialogOpen(true)}>Abrir diálogo</Button>
          <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
            Abrir panel lateral
          </Button>
        </div>
        <Modal
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Eliminar emisor"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={() => setIsDialogOpen(false)}>
                Eliminar
              </Button>
            </>
          }
        >
          Se borrarán también sus cobros y su historial. Esta acción no se puede
          deshacer.
        </Modal>
        <Modal
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Detalle del emisor"
          placement="right"
        >
          <Input label="Nombre" defaultValue="Ana Pérez" />
        </Modal>
      </section>
    </main>
  );
};

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider>
      <Demo />
    </ThemeProvider>
  </StrictMode>,
);
