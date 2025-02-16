import { Container, Row, Col, Image } from "react-bootstrap";

const HomePage = () => {
  return (
    <Container>
      <Row className="px-4 my-5">
        <Col xs={4} sm={6}>
          <Image src="/vite.svg" alt="logo" fluid className="logo-class" />
        </Col>
        <Col sm={6}>
          <h1 className="font-weight-light">Module Manager</h1>
          <p className="mt-4">
            Lorem Ipsum
            <br />
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;