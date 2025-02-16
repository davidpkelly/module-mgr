import { createFileRoute } from "@tanstack/react-router";
import UsersPage from "@/src/pages/UsersPage";

export const Route = createFileRoute("/_auth/users")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UsersPage />;
}