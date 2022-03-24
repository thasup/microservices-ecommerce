import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import Loader from "../../components/Loader";
import Product from "../../components/Product";

const Tops = ({ products, currentUser }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products) {
      setLoading(false);
    }
  }, []);

  const tops = products.filter((product) => product.category === "Top");

  return loading ? (
    <div
      className="d-flex justify-content-center align-items-center px-0"
      style={{ marginTop: "80px" }}
    >
      <Loader />
    </div>
  ) : (
    <>
      <Row className="mx-0">
        {tops.map((item) => (
          <Col key={item.id} xs={6} md={4} xl={3} className="p-0">
            <Product product={item} currentUser={currentUser} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Tops;
