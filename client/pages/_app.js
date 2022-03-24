import React from "react";
import Head from "next/head";
import { Container, SSRProvider } from "react-bootstrap";

import "../styles/bootstrap.min.css";
import "../styles/globals.css";

import buildClient from "../api/build-client";
import Footer from "../components/Footer";
import CustomHeader from "../components/CustomHeader";

const MyApp = ({ Component, pageProps, currentUser }) => {
  console.log("Current User (_app) : ", currentUser);
  console.log("All props (_app) : ", { ...pageProps });

  return (
    <SSRProvider>
      <Head>
        <title>Aurapan | Women's Clothing Online Shop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CustomHeader currentUser={currentUser} />
      <main className="pb-5" style={{ marginTop: "74px" }}>
        <Container fluid className="px-0">
          <Component currentUser={currentUser} {...pageProps} />
        </Container>
      </main>
      <Footer />
    </SSRProvider>
  );
};

MyApp.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  const { data: products } = await client.get("/api/products");

  const { data: users } = await client.get("/api/users");

  const { data: orders } = await client.get("/api/orders");

  const { data: bestseller } = await client.get("/api/products/bestseller");

  let pageProps = { products, users, orders, bestseller };
  if (data.currentUser !== null) {
    const { data: myOrders } = await client.get("/api/orders/myorders");
    pageProps = { products, users, orders, bestseller, myOrders };
  }

  return {
    pageProps,
    ...data,
  };
};

export default MyApp;
