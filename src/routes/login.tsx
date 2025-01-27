import * as React from "react";
import { useState } from "react";

import {
  createFileRoute,
  redirect,
  useRouter,
  useRouterState,
  Link,
} from "@tanstack/react-router";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useAuth } from "../auth";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const fallback = "/main" as const;

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      // @ts-ignore
      throw redirect({ to: search?.redirect || fallback });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const navigate = Route.useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const search = Route.useSearch();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    try {
      evt.preventDefault();
      //   const data = new FormData(evt.currentTarget);
      //   const fieldValue = data.get("username");

      //   if (!fieldValue) return;
      //   const username = fieldValue.toString();
      if (!username) return;
      await auth.login(username, password);

      await router.invalidate();

      // This is just a hack being used to wait for the auth state to update
      // in a real app, you'd want to use a more robust solution
      await sleep(1);
      // @ts-ignore
      await navigate({ to: search.redirect || fallback });
    } catch (error) {
      console.error("Error logging in: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoggingIn = isLoading || isSubmitting;

  return (
    <Container>
      <Row className="justify-content-md-center px-4 my-5">
        <Col sm={6}>
          <h1>Login</h1>
        </Col>
      </Row>
      <Row className="justify-content-md-center px-4 my-5">
        <Col sm={6}>
          <Form onSubmit={onFormSubmit}>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User Name"
                onChange={(evt) => setUserName(evt.target.value)}
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
            <Button variant="primary" type="submit">
              {isLoggingIn ? "Loading..." : "Login >>"}
            </Button>
            &nbsp;&nbsp;
            <Link to="/register">
              <Button variant="outline-primary">Register</Button>
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
