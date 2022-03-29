import { useEffect, useState } from "react";
import { Breadcrumb, Col, Row } from "react-bootstrap";
import Link from "next/link";
import Head from "next/head";

import Product from "../../../components/Product";
import Loader from "../../../components/Loader";

const CoatsBestseller = ({ bestseller, currentUser }) => {
  const [loading, setLoading] = useState(true);

  const coatsBestseller = bestseller.filter((coat) => coat.category === "Coat");

  useEffect(() => {
    if (bestseller && coatsBestseller) {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Bestseller Coats | Aurapan</title>
      </Head>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center px-0"
          style={{ marginTop: "80px" }}
        >
          <Loader />
        </div>
      ) : (
        <>
          <h1 className="category-header">Bestseller Coats</h1>
          <Breadcrumb className="breadcrumb-label">
            <Link href="/" passHref>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
            </Link>

            <Link href="/products/coats" passHref>
              <Breadcrumb.Item>Coats</Breadcrumb.Item>
            </Link>

            <Link href="/products/coats/bestseller" passHref>
              <Breadcrumb.Item>Bestseller</Breadcrumb.Item>
            </Link>
          </Breadcrumb>

          <Row className="mx-0">
            {coatsBestseller.map((item) => (
              <Col key={item.id} xs={6} md={4} xl={3} className="p-0">
                <Product product={item} currentUser={currentUser} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default CoatsBestseller;
