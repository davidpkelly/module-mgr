import { useState } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";

import { Button, Col, Container, Form, Row } from "react-bootstrap";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  // @ts-ignore
  const [username, setUserName] = useState("");
  // @ts-ignore
  const [password, setPassword] = useState("");
  // @ts-ignore
  const [email, setEmail] = useState("");

  return (
    <Container>
      <Row className="justify-content-md-center px-4 my-5">
        <Col sm={6}>
          <h1>Register</h1>
        </Col>
      </Row>
      <Row className="justify-content-md-center px-4 my-5">
        <Col sm={6}>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User Name"
                onChange={(evt) => setUserName(evt.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                onChange={(evt) => setEmail(evt.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                minLength={8}
                placeholder="Enter Password"
                onChange={(evt) => setPassword(evt.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="button">
              Register &gt;&gt;
            </Button>
            &nbsp;&nbsp;
            <Link to="/login">
              <Button variant="outline-primary">Login</Button>
            </Link>
            &nbsp;&nbsp;
            <Link to="/">
              <Button variant="outline-primary">Cancel</Button>
            </Link>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
