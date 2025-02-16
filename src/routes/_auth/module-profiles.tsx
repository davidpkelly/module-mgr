import { createFileRoute } from "@tanstack/react-router";
import { Container, Col, Row } from "react-bootstrap";

export const Route = createFileRoute("/_auth/module-profiles")({
  component: ModuleProfiles,
});

function ModuleProfiles() {
  return (
    <Container>
      <Row className="px-4 my-5">
        <Col xs={6}>
          <h1>Module Profiles</h1>
        </Col>
        <Col></Col>
      </Row>
      <Row className="px-4 my-5">
        <Col>
          <Row>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
