import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import buildClient from "../../api/build-client";
import Loader from "../../components/Loader";
import Product from "../../components/Product";

const Dresses = ({ products, currentUser }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products) {
      setLoading(false);
    }
  }, []);

  const dresses = products.filter((product) => product.category === "Dress");

  return loading ? (
    <Loader />
  ) : (
    <>
      <Row className="mx-0">
        {dresses.map((item) => (
          <Col key={item.id} xs={6} md={4} xl={3} className="p-0">
            <Product product={item} currentUser={currentUser} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data } = await client.get("/api/products").catch((err) => {
    console.log(err.message);
  });

  return { props: { products: data } };
}

export default Dresses;
