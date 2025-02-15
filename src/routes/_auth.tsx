import {
  createFileRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router";
import { useAuth } from "../auth";
import { Col, Container, Row } from "react-bootstrap";

import SideBar from "../components/SideBar";

import "./index.css";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthContent,
});

function AuthContent() {
  const auth = useAuth();

  const getUserRole = ():string => {
    const role = JSON.parse(JSON.stringify(auth.user?.payload))["cognito:groups"];
    if (role?.includes("SUPERADMIN")) {
      return "super";
    } else if (role?.includes("ADMIN")) {
      return "admin";
    } else {
      return "user";
    }
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={2} className="sidebar px-0">
            <SideBar userRole={getUserRole()}/>
          </Col>
          <Col xs={10} className="px-2">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </>
  );
}
