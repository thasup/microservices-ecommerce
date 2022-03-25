import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import Product from "../../components/Product";
import Loader from "../../components/Loader";
import Head from "next/head";

const BestSeller = ({ bestseller, currentUser }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bestseller) {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>BestSeller | Aurapan</title>
      </Head>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center px-0"
          style={{ marginTop: "80px" }}
        >
          <Loader />
        </div>
      ) : (
        <Row className="mx-0">
          {bestseller.map((item) => (
            <Col key={item.id} xs={6} md={4} xl={3} className="p-0">
              <Product product={item} currentUser={currentUser} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default BestSeller;
