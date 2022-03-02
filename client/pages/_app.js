import React from "react";
import Head from "next/head";
import { Container } from "react-bootstrap";

import "../styles/bootstrap.min.css";
import "../styles/globals.css";

import buildClient from "../api/build-client";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MyApp = ({ Component, pageProps, currentUser }) => {
  console.log(currentUser);

  return (
    <>
      <Head>
        <title>Aurapan</title>
        <meta name="description" content="Be your beautiful best." />
        <link rel="icon" href="./asset/favicon.png" />
        {/* Add Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Italiana&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
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
      <main className="pt-3 pb-5">
        <Container fluid className="px-0">
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
