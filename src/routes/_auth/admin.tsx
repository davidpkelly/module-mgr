import { createFileRoute } from "@tanstack/react-router";
import { Container, Row as FlexRow } from "react-bootstrap";
import TableComponent from "../../components/TableComponent";

export const Route = createFileRoute("/_auth/admin")({
  component: AdminComponent,
});

function AdminComponent() {
  return (
    <Container fluid>
      <FlexRow>
        <TableComponent />
      </FlexRow>
    </Container>
  );
}
