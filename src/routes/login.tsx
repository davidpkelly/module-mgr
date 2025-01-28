import * as React from "react";
import { useState } from "react";

import {
  createFileRoute,
  redirect,
  useRouter,
  useRouterState,
  Link,
} from "@tanstack/react-router";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useAuth } from "../auth";
import { Envelope, Eye, EyeSlash, Lock } from "react-bootstrap-icons";

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
  const [warnEmail, setWarnEmail] = useState(false);
  const [warnPassword, setWarnPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("password");
  const [eye, setEye] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    try {
      evt.preventDefault();
      setWarnEmail(false);
      setWarnPassword(false);
      if (!username) {
        setWarnEmail(true);
      } else if (password == "") {
        setWarnPassword(true);
      }
      if (warnEmail || warnPassword) {
        return;
      }
      await auth.login(username, password);
      await router.invalidate();

      // This is just a hack being used to wait for the auth state to update
      // in a real app, you'd want to use a more robust solution
      await new Promise((resolve) => setTimeout(resolve, 1));
      // @ts-ignore
      await navigate({ to: search.redirect || fallback });
    } catch (error: any) {
      if (error?.name === "NotAuthorizedException") {
        setShowToast(true);
      } else {
        console.error("Failed to sign in:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const showHidePassword = () => {
    if (passwordInput == "password") {
      setPasswordInput("text");
      setEye(false);
    } else {
      setPasswordInput("password");
      setEye(true);
    }
  };

  const cancelLogin = async () => {
    setUserName("");
    setPassword("");
    setWarnEmail(false);
    setWarnPassword(false);
    try {
      await auth.logout();
    } catch (error) {}
  };

  const resetPassword = async () => {
    try {
      await auth.resetPassword();
    } catch (error) {
      console.error("Error resetting password: ", error);
    }
  };

  const isLoggingIn = isLoading || isSubmitting;

  return (
    <>
      <ToastContainer position="top-center">
        <Toast
          className="d-inline-block m-1"
          bg={"warning"}
          onClose={() => setShowToast(false)}
          show={showToast}
          autohide
        >
          <Toast.Body>
            Failed to login. Check your username and password.
          </Toast.Body>
        </Toast>
      </ToastContainer>
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
                <Form.Label>Email</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <Envelope size={16} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Email"
                    onChange={(evt) => setUserName(evt.target.value)}
                    isInvalid={warnEmail}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <Lock size={16} />
                  </InputGroup.Text>
                  <Form.Control
                    type={passwordInput}
                    minLength={8}
                    placeholder="Enter Password"
                    onChange={(evt) => setPassword(evt.target.value)}
                    isInvalid={warnPassword}
                  />
                  <InputGroup.Text>
                    {eye ? (
                      <EyeSlash
                        size={16}
                        onClick={(_evt) => showHidePassword()}
                      />
                    ) : (
                      <Eye size={16} onClick={(_evt) => showHidePassword()} />
                    )}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3 forgot">
                <Form.Text as="small">
                  Forgot your password?{" "}
                  <a href="#" onClick={() => resetPassword()}>
                    Reset Password
                  </a>
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                {isLoggingIn ? "Loading..." : "Login >>"}
              </Button>
              &nbsp;&nbsp;
              <Link to="/">
                <Button variant="outline-primary" onClick={() => cancelLogin()}>
                  Cancel
                </Button>
              </Link>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
