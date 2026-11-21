import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library no desmonta solo cuando no hay globals de vitest.
afterEach(() => {
  cleanup();
});
