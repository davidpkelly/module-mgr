import { createFileRoute } from "@tanstack/react-router";
import { Container, Col, Row } from "react-bootstrap";

export const Route = createFileRoute("/_auth/audit_logs")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <Container>
      <Row className="px-4 my-5">
        <Col xs={6}>
          <h1>Audit Logs</h1>
        </Col>
        <Col></Col>
      </Row>
      <Row className="px-4 my-5">
        <Col>
          <Row>{/* <TableComponent /> */}</Row>
        </Col>
      </Row>
    </Container>
  );
}
