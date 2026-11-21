<p align="right"><a href="README.md">🇬🇧 English</a> · 🇦🇷 Español</p>

# Farol UI

Componentes React accesibles, en azul, con modo claro y oscuro. Chicos, tipados y con tests.

- **Accesibles de entrada:** campos con etiqueta, navegación con teclado, manejo del foco y foco visible. Los tests verifican que cada par de colores cumpla el contraste AA de WCAG en los dos temas.
- **Claro y oscuro desde una sola fuente:** cada color se declara una vez con `light-dark()` de CSS. Sigue al sistema, o se puede forzar.
- **Sin librería de estilos en ejecución:** CSS Modules y variables CSS. Unos 3,7 kB de JS y 2 kB de CSS (comprimidos).
- **Solo dependencias peer:** React 18 o superior.

## Instalación

```bash
npm install farol-ui
```

## Uso

Importá los estilos una sola vez y envolvé tu app en `ThemeProvider` si querés el cambio de tema.

```tsx
import "farol-ui/styles.css";
import { Button, Card, Input, ThemeProvider, useTheme } from "farol-ui";

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button variant="ghost" onClick={toggleTheme}>
      Tema: {theme}
    </Button>
  );
};

export const App = () => (
  <ThemeProvider>
    <Card title="Iniciar sesión">
      <Input label="Correo" type="email" />
      <Button>Continuar</Button>
      <ThemeButton />
    </Card>
  </ThemeProvider>
);
```

### Evitar el parpadeo del tema equivocado

Con renderizado en servidor, agregá este script al `<head>` para aplicar el tema guardado antes del primer pintado:

```tsx
import { getThemeInitScript } from "farol-ui";

<script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />;
```

## Componentes

| Componente | Para qué sirve                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| `Button`   | Acciones. Variantes `primary`, `secondary`, `ghost`, `danger`; tamaños; `isLoading`.                      |
| `Input`    | Campo de texto con etiqueta obligatoria, ayuda y error conectados con `aria-describedby`.                 |
| `Select`   | Selector nativo con la misma etiqueta, ayuda y error.                                                     |
| `Checkbox` | Casilla nativa con etiqueta y ayuda.                                                                      |
| `Card`     | Contenedor con título opcional (se elige el nivel del encabezado) y pie.                                  |
| `Badge`    | Etiqueta de estado. Tonos `neutral`, `info`, `success`, `warning`, `danger`.                              |
| `Modal`    | Diálogo o panel lateral (`placement="right"`). Escape, foco atrapado, devuelve el foco, scroll bloqueado. |
| `Tabs`     | Pestañas con flechas, Inicio y Fin, saltando las deshabilitadas.                                          |

## Personalización

Colores, espaciados, radios y tamaños de letra son variables CSS con el prefijo `--farol-`. Se pueden sobrescribir en tu propio CSS:

```css
:root {
  --farol-color-primary: light-dark(#0f766e, #5eead4);
}
```

Forzá un tema en toda la página o en un contenedor con `data-theme="light"` o `data-theme="dark"`.

## Desarrollo

```bash
npm install
npm run storybook   # galería de componentes con cambio claro/oscuro en http://localhost:6006
npm run verificar   # lint, tipos, tests y build
```

## Licencia

MIT
