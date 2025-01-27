import { useRouterState } from "@tanstack/react-router";

import { Nav } from "react-bootstrap";
import "../index.css";

const SideBar = () => {
  const state = useRouterState();
  const activeRoute = state.location.pathname;

  return (
    <Nav className="flex-column" defaultActiveKey="/main">
      <Nav.Item className="mt-2">
        <Nav.Link
          href="/main"
          eventKey="link-1"
          active={activeRoute === "/main"}
        >
          Configure
        </Nav.Link>
      </Nav.Item>
      <Nav.Item className="mt-2">
        <Nav.Link
          href="/admin"
          eventKey="link-2"
          active={activeRoute === "/admin"}
        >
          Admin
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};
export default SideBar;
