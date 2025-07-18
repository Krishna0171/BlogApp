// src/test/setup.ts
import "@testing-library/jest-dom";
import { server } from "./server";
import { vi } from "vitest";

// Start API mocking before all tests
beforeAll(() => server.listen());
// Reset handlers after each test
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished
afterAll(() => server.close());

// src/vitest.setup.ts

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
