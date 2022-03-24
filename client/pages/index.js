import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";

const Home = ({ products, currentUser }) => {
  return (
    <>
      <Row className="mx-0">
        {products.map((item) => (
          <Col key={item.id} xs={6} md={4} xl={3} className="p-0">
            <Product product={item} currentUser={currentUser} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Home;
