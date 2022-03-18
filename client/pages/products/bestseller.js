import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import buildClient from "../../api/build-client";
import Product from "../../components/Product";
import Loader from "../../components/Loader";

const BestSeller = ({ products, currentUser }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products) {
      setLoading(false);
    }
  }, []);

  return loading ? (
    <div
      className="d-flex justify-content-center align-items-center px-0"
      style={{ marginTop: "80px" }}
    >
      <Loader />
    </div>
  ) : (
    <Row className="mx-0">
      {products.map((item) => (
        <Col key={item.id} xs={6} md={4} xl={3} className="p-0">
          <Product product={item} currentUser={currentUser} />
        </Col>
      ))}
    </Row>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data } = await client.get("/api/products/bestseller").catch((err) => {
    console.log(err.message);
  });

  return { props: { products: data } };
}

export default BestSeller;
