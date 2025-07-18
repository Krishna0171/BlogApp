import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../Login";
import { customRender } from "../../../utils/test.utils";
import { Route } from "react-router-dom";
import Navbar from "../../../components/Navbar";

describe("Login Page", () => {
  it("should render login form and submit successfully", async () => {
    customRender({
      route: "/login",
      path: "/login",
      element: <Login />,
      routes: [<Route path="/" element={<h1>Dashboard</h1>} />],
    });

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitBtn = screen.getByRole("button", { name: "Login" });

    await userEvent.type(emailInput, "test@dev.com");
    await userEvent.type(passwordInput, "123456");
    await userEvent.click(submitBtn);

    const dashboardTitle = await screen.findByText(/dashboard/i);
    expect(dashboardTitle).toBeInTheDocument();
  });
});

describe("Logout", () => {
  it("should logout and render login page", async () => {
    customRender({
      route: "/",
      path: "/",
      element: <Navbar />,
      routes: [<Route path="/login" element={<h1>Login</h1>} />],
    });

    const logoutBtn = await screen.findByText("Logout");
    await userEvent.click(logoutBtn);

    const confirmLogoutBtn = screen.getByRole("button", { name: "Logout" });
    await userEvent.click(confirmLogoutBtn);

    const loginPage = await screen.findByText("Login");
    expect(loginPage).toBeInTheDocument();
  });
});
