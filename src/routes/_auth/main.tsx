import { createFileRoute } from "@tanstack/react-router";
import MainPage from "../../pages/MainPage";

export const Route = createFileRoute("/_auth/main")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MainPage />;
}
