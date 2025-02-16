import AuditLogPage from "@/src/pages/AuditLogPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/audit_logs")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AuditLogPage />;
}
