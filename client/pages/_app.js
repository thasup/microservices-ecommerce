import React from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";

import "../styles/bootstrap.css";
import "../styles/globals.css";

import buildClient from "../api/build-client";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MyApp = ({ Component, pageProps, currentUser }) => {
  console.log(pageProps);
  console.log(currentUser);

  return (
    <>
      <Head>
        <title>Aurapan Shop</title>
        <meta
          name="description"
          content="The most beautiful dresses for all women."
        />
        <link rel="icon" href="./asset/favicon.png" />
        {/* Add Font Awesome CDN */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />
      </Head>
      <Header currentUser={currentUser} />
      <main className="py-3">
        <Container fluid>
          <Component currentUser={currentUser} {...pageProps} />
        </Container>
      </main>
      <Footer />
    </>
  );
};

MyApp.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default MyApp;
