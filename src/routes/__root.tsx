import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import type { AuthContext } from "../auth";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

interface RouterContextAuth {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContextAuth>()({
  component: RootComponent,
});

function RootComponent() {
  const {auth} = Route.useRouteContext();

  return (
    <>
      <NavBar isAuthenticated={auth.isAuthenticated}/>
      <Footer />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}