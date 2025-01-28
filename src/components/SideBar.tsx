import { useRouterState } from "@tanstack/react-router";

import { Nav, NavItem, NavDropdown } from "react-bootstrap";
import "../index.css";

const SideBar = () => {
  const state = useRouterState();
  const activeRoute = state.location.pathname;

  return (
    <Nav className="flex-column" defaultActiveKey="/main">
      <NavItem className="mt-2">
        <Nav.Link
          href="/main"
          eventKey="link-1"
          active={activeRoute === "/main"}
        >
          Configure
        </Nav.Link>
        <NavDropdown title="Admin" id="sidebar-sub-menu" show={true}>
          <NavDropdown.Item
            href="/module-profiles"
            active={activeRoute === "/module-profiles"}
          >
            Module Profiles
          </NavDropdown.Item>
          <NavDropdown.Item href="/users" active={activeRoute === "/users"}>
            User Mgmt
          </NavDropdown.Item>
        </NavDropdown>
      </NavItem>
    </Nav>
  );
};
export default SideBar;
