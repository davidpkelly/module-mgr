import { createFileRoute } from "@tanstack/react-router";
import { Container, Col, Row } from "react-bootstrap";

export const Route = createFileRoute("/_auth/user-profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container>
      <Row className="px-4 my-5">
        <Col xs={6}>
          <h1>User Profile</h1>
        </Col>
        <Col></Col>
      </Row>
      <Row className="px-4 my-5">
        <Col></Col>
        <Col xs={6}></Col>
      </Row>
    </Container>
  );
}
