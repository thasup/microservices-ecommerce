import { Card, Col, Container, Row } from "react-bootstrap";
import buildClient from "../api/build-client";
import Product from "../components/Product";
import styles from "../styles/Home.module.css";

const Home = ({ products, currentUser }) => {
  console.log(products);
  return (
    <>
      <Row>
        {products.map((item) => (
          <Col key={item.id} xs={6} md={4} xl={3} className="p-0">
            <Product product={item} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const { data } = await client.get("/api/products");

  return { props: { products: data } };
}

export default Home;
