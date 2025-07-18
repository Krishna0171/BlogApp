// test/handlers.ts
import { http, HttpResponse } from "msw";
import type { LoginFormData } from "../interfaces/interfaces";

export const handlers = [
  http.post("/api/login", async ({ request }) => {
    const { email, password } = (await request.json()) as LoginFormData;
    if (email === "test@dev.com" && password === "123456") {
      return HttpResponse.json({ token: "mock-token" });
    }
    return HttpResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }),

  http.post("/api/logout", () => {
    return HttpResponse.json({ message: "Logged out" });
  }),
];
