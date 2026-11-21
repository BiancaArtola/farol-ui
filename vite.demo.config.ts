import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Servidor de la página de demostración (carpeta demo/); no forma parte del paquete.
export default defineConfig({
  root: "demo",
  plugins: [react()],
  server: { port: 5199 },
});
