// src/test-utils.tsx
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { store } from "../store";

interface CustomRenderOptions {
  route?: string;
  path?: string;
  element: React.ReactElement;
  routes?: React.ReactElement[];
}

export function customRender({
  route = "/",
  path = "/",
  element,
  routes = [],
}: CustomRenderOptions) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Provider store={store}>
        <Routes>
          <Route path={path} element={element} />
          {routes}
        </Routes>
      </Provider>
    </MemoryRouter>
  );
}
