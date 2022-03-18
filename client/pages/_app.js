import React from "react";
import Head from "next/head";
import { Container, SSRProvider } from "react-bootstrap";
import Script from "next/script";

import "../styles/bootstrap.min.css";
import "../styles/globals.css";

import buildClient from "../api/build-client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomHeader from "../components/CustomHeader";

const MyApp = ({ Component, pageProps, currentUser }) => {
  console.log("Current User : ", currentUser);

  return (
    <SSRProvider>
      <Head>
        <title>Aurapan | Women's Clothing Online Shop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CustomHeader currentUser={currentUser} {...pageProps} />
      <main className="pb-5">
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
  const { data: data } = await client.get("/api/users/currentuser");

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
