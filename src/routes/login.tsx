import * as React from "react";
import { useState } from "react";

import {
  createFileRoute,
  redirect,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useAuth } from "../auth";
import { Envelope, Eye, EyeSlash, Lock } from "react-bootstrap-icons";
import { AuthError } from "aws-amplify/auth";
import ToastMessage from "../components/ToastMessage";

const fallback = "/main" as const;

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      // @ts-ignore
      throw redirect({ to: search?.redirect || fallback });
    }
    return context.auth.user;
  },
  component: LoginPage,
});

function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const navigate = Route.useNavigate();
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const search = Route.useSearch();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [warnEmail, setWarnEmail] = useState(false);
  const [warnPassword, setWarnPassword] = useState(false);
  const [warnNewPassword, setWarnNewPassword] = useState(false);
  const [warnConfirmNewPassword, setWarnConfirmNewPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("password");
  const [newPasswordInput, setNewPasswordInput] = useState("password");
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] =
    useState("password");
  const [eye, setEye] = useState(true);
  const [confirmEye, setConfirmEye] = useState(true);
  const [showToast, setShowToast] = useState("");
  // const [resetPassword, setResetPassword] = useState(false);

  const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    let signedInUser;
    setIsSubmitting(true);
    evt.preventDefault();
    setWarnEmail(false);
    setWarnPassword(false);
    setWarnNewPassword(false);
    setWarnConfirmNewPassword(false);

    if (!showConfirmNewPassword) {
      if (!username) {
        setWarnEmail(true);
      } else if (password == "") {
        setWarnPassword(true);
      }
      if (warnEmail || warnPassword) {
        return;
      }
      try {
        signedInUser = await auth.login(username, password);
      } catch (error: any) {
        if (
          error instanceof AuthError &&
          error?.name === "NotAuthorizedException"
        ) {
          setShowToast("Failed to login. Check your username and password.");
          return;
        } else {
          console.error("Failed to sign in:", error);
        }
      } finally {
        setIsSubmitting(false);
      }
      if (
        signedInUser?.nextStep?.signInStep ===
          "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED" ||
        signedInUser?.nextStep?.signInStep === "RESET_PASSWORD"
      ) {
        // @ts-ignore
        evt?.target?.reset();
        setShowConfirmNewPassword(true);
        return;
      }
    } else {
      if (
        !newPassword ||
        !confirmNewPassword ||
        newPassword !== confirmNewPassword
      ) {
        setWarnNewPassword(true);
        setWarnConfirmNewPassword(true);
      }
      try {
        const confirmSignInResponse = await auth.confirmLogIn(newPassword);
        if (confirmSignInResponse.nextStep.signInStep !== "DONE") {
          console.error("SignInStep not DONE");
        }
      } catch (error) {
        console.log("Error confirming new password", error);
      } finally {
        setIsSubmitting(false);
      }
    }
    if (signedInUser?.nextStep?.signInStep !== "DONE") {
      setShowToast(
        `Failed to login: ${
          signedInUser?.nextStep?.signInStep || "Unknown Error"
        }`
      );
    }
    await router.invalidate();
    // @ts-ignore
    await navigate({ to: search.redirect || fallback });
  };

  const showHidePassword = (idx: string) => {
    if (idx === "new") {
      if (newPasswordInput == "password") {
        setNewPasswordInput("text");
        setEye(false);
      } else {
        setNewPasswordInput("password");
        setEye(true);
      }
    } else if (idx === "confirm") {
      if (confirmNewPasswordInput == "password") {
        setConfirmNewPasswordInput("text");
        setConfirmEye(false);
      } else {
        setConfirmNewPasswordInput("password");
        setConfirmEye(true);
      }
    } else {
      if (passwordInput == "password") {
        setPasswordInput("text");
        setEye(false);
      } else {
        setPasswordInput("password");
        setEye(true);
      }
    }
  };

  const cancelLogin = async () => {
    setUserName("");
    setPassword("");
    setWarnEmail(false);
    setWarnPassword(false);
    try {
      await auth.logout();
      router.invalidate().finally(() => {
        navigate({ to: "/" });
      });
    } catch (error) {}
  };

  const resetPassword = async (username: string) => {
    try {
      await auth.resetPasswd(username);
    } catch (error) {
      console.error("Error resetting password: ", error);
    }
  };

  const isLoggingIn = isLoading || isSubmitting;

  return (
    <>
      <ToastMessage show={showToast !== ""} onClose={() => setShowToast("")} message={showToast} type="warning" />
      <Container>
        <Row className="justify-content-md-center px-4 my-5">
          <Col sm={6}>
            {!showConfirmNewPassword ? (
              <h1>Login</h1>
            ) : (
              <h2>Confirm New Password</h2>
            )}
          </Col>
        </Row>
        <Row className="justify-content-md-center px-4 my-5">
          <Col sm={6}>
            <Form onSubmit={onFormSubmit}>
              {!showConfirmNewPassword ? (
                <>
                  <Form.Group className="mb-3" controlId="username">
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
                  <Form.Group className="mb-3" controlId="password">
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
                            onClick={(_evt) => showHidePassword("")}
                          />
                        ) : (
                          <Eye
                            size={16}
                            onClick={(_evt) => showHidePassword("")}
                          />
                        )}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3 forgot">
                    <Form.Text as="small">
                      Forgot your password?{" "}
                      <a href="#" onClick={() => resetPassword("fixme")}>
                        Reset Password
                      </a>
                    </Form.Text>
                  </Form.Group>
                </>
              ) : (
                <>
                  <Form.Group
                    className="mb-3"
                    controlId="formBasicNewConfirmPassword"
                  >
                    <Form.Label>New Password</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>
                        <Lock size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        type={newPasswordInput}
                        minLength={8}
                        placeholder="Enter Password"
                        onChange={(evt) => setNewPassword(evt.target.value)}
                        isInvalid={warnNewPassword}
                      />
                      <InputGroup.Text>
                        {eye ? (
                          <EyeSlash
                            size={16}
                            onClick={(_evt) => showHidePassword("new")}
                          />
                        ) : (
                          <Eye
                            size={16}
                            onClick={(_evt) => showHidePassword("new")}
                          />
                        )}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>
                        <Lock size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        type={confirmNewPasswordInput}
                        minLength={8}
                        placeholder="Confirm Password"
                        onChange={(evt) =>
                          setConfirmNewPassword(evt.target.value)
                        }
                        isInvalid={warnConfirmNewPassword}
                      />
                      <InputGroup.Text>
                        {confirmEye ? (
                          <EyeSlash
                            size={16}
                            onClick={(_evt) => showHidePassword("confirm")}
                          />
                        ) : (
                          <Eye
                            size={16}
                            onClick={(_evt) => showHidePassword("confirm")}
                          />
                        )}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </>
              )}
              <Button variant="primary" type="submit">
                {isLoggingIn
                  ? "Loading..."
                  : !showConfirmNewPassword
                  ? "Login >>"
                  : "Submit >>"}
              </Button>
              &nbsp;&nbsp;
              <Button variant="outline-primary" onClick={() => cancelLogin()}>
                Cancel
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
