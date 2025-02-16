import { createFileRoute, redirect } from "@tanstack/react-router";
import HomePage from "../pages/HomePage";

import "./index.css";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/main" });
    }
  },
  component: IndexPage,
});

function IndexPage() {
  return <HomePage />;
}
