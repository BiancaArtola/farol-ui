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

| Componente                   | Para qué sirve                                                                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                     | Acciones. Variantes `primary`, `secondary`, `ghost`, `danger`; tamaños; `isLoading`.                                                    |
| `Input`                      | Campo de texto con etiqueta obligatoria, ayuda y error conectados con `aria-describedby`.                                               |
| `Select`                     | Selector nativo con la misma etiqueta, ayuda y error.                                                                                   |
| `Checkbox`                   | Casilla nativa con etiqueta y ayuda.                                                                                                    |
| `Card`                       | Contenedor con título opcional (se elige el nivel del encabezado) y pie.                                                                |
| `Badge`                      | Etiqueta de estado. Tonos `neutral`, `info`, `success`, `warning`, `danger`.                                                            |
| `Modal`                      | Diálogo o panel lateral (`placement="right"`). Escape, foco atrapado, devuelve el foco, scroll bloqueado.                               |
| `Tabs`                       | Pestañas con flechas, Inicio y Fin, saltando las deshabilitadas.                                                                        |
| `Table`                      | Tabla de datos accesible: columnas numéricas, cabeceras ordenables (`aria-sort`), estado vacío. Se combina con `sortRows` y `nextSort`. |
| `TableToolbar`               | Buscador, filtros y contador para poner sobre una `Table`.                                                                              |
| `LoadMore`                   | Cierre "Mostrando 100 de 250" con botón; no dibuja nada cuando ya se ve todo.                                                           |
| `Alert`                      | Aviso con tonos `info`, `success`, `warning`, `danger` (rol `alert` en los graves).                                                     |
| `EmptyState`                 | Título, descripción y una acción para listas sin datos.                                                                                 |
| `Textarea`                   | Campo multilínea con la misma etiqueta, ayuda y error que `Input`.                                                                      |
| `Switch`                     | Casilla nativa con `role="switch"`.                                                                                                     |
| `RadioGroup`                 | Fieldset con leyenda y radios nativos (funcionan las flechas).                                                                          |
| `Avatar`                     | Iniciales con el nombre completo como nombre accesible.                                                                                 |
| `StatCard`                   | Dato clave con ícono opcional; si tiene `onClick` pasa a ser un botón.                                                                  |
| `ButtonLink`                 | Enlace (`<a>`) con el aspecto de un `Button`. Para el `Link` de Next, `className={buttonClassName()}`.                                  |
| `ToastProvider` / `useToast` | Avisos temporales: `showToast({ message, tone })`. Los errores usan `role="alert"`, el resto `status`; se cierran solos.                |

## Personalización

### Una marca para todos los componentes

`createTheme` convierte un color de marca, una tipografía y un estilo de esquinas en variables CSS, y `ThemeProvider` las aplica a toda la página. Todos los componentes de farol-ui las toman, así que el estilo se define una vez por proyecto:

```tsx
import { ThemeProvider, createTheme } from "farol-ui";

const theme = createTheme({
  primary: "#0e7490", // un solo hex: se ajusta para que se lea en claro y en oscuro
  fontFamily: '"Inter", system-ui, sans-serif',
  radius: "round", // "sharp" | "default" | "round"
});

<ThemeProvider theme={theme}>{/* tu app */}</ThemeProvider>;
```

- Un hex suelto se corrige hasta que el texto y los botones lleguen a WCAG AA (4,5:1) en ambos temas. Para elegir los dos exactos, pasá `{ light, dark }`; si ese par no se lee, `createTheme` falla y dice cuál.
- Sin `fontFamily`, los componentes heredan la fuente de tu página. La fuente se carga por tu cuenta (por ejemplo con `next/font`) y en tu CSS podés usar `font-family: var(--farol-font-family)` para que coincida.
- Ejemplos listos: `farolTheme`, `tealTheme`, `violetTheme`.
- En el servidor, `themeToCss(theme)` devuelve un `:root { ... }` para poner en un `<style>` y que el primer pintado ya tenga tu marca.

### CSS directo

Colores, espaciados, radios y tamaños de letra son variables CSS con el prefijo `--farol-`. También se pueden sobrescribir en tu propio CSS:

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

TypeScript está instalado dos veces a propósito: `typescript` es un alias de TypeScript 6 (el que soporta `typescript-eslint`) y `@typescript/native` es TypeScript 7, que aporta el binario `tsc`. `eslint-plugin-jsx-a11y` todavía no declara soporte para ESLint 10, por eso `package.json` tiene una entrada `overrides`; el lint y los tests funcionan con ella. Se quitan las dos cosas cuando los paquetes se pongan al día.

## Licencia

MIT
