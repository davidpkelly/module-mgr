import { Container, Row, Col } from "react-bootstrap";

const HomePage = () => {
  return (
    <Container>
      <Row className="px-4 my-5">
        <Col sm={6}>
          <h1 className="font-weight-light">Customer Accounts</h1>
          <p className="mt-4">
            Place holder for creating and associating customer accounts with users.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;