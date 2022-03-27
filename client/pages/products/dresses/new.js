import { useEffect, useState } from "react";
import { Breadcrumb, Col, Row } from "react-bootstrap";

import Product from "../../../components/Product";
import Loader from "../../../components/Loader";
import Head from "next/head";
import Link from "next/link";

const DressesNewArrivals = ({ products, currentUser }) => {
  const [onMobile, setOnMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  const dressesNewArrivals = products
    .filter((dress) => dress.category === "Dress")
    .reverse()
    .slice(0, 4);

  useEffect(() => {
    if (window.innerWidth <= 576) {
      setOnMobile(true);
    } else {
      setOnMobile(false);
    }

    if (products && dressesNewArrivals) {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>New Arrivals Dresses | Aurapan</title>
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
          <h1 className="category-header">New Arrivals Dresses</h1>
          <Breadcrumb className={onMobile ? "px-3" : "px-5"}>
            <Link href="/" passHref>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
            </Link>

            <Link href="/products/dresses" passHref>
              <Breadcrumb.Item>Dresses</Breadcrumb.Item>
            </Link>

            <Link href="/products/dresses/new" passHref>
              <Breadcrumb.Item>New Arrivals</Breadcrumb.Item>
            </Link>
          </Breadcrumb>

          <Row className="mx-0">
            {dressesNewArrivals.map((item) => (
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

export default DressesNewArrivals;