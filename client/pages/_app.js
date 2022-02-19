import React from "react";
import axios from "axios";
import Head from "next/head";
import { Container } from "react-bootstrap";
import "../styles/bootstrap.css";
import "../styles/globals.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

const MyApp = ({ Component, pageProps, data, currentUser }) => {
  // const {
  //   data: { currentUser },
  // } = pageProps;

  console.log(pageProps);
  console.log(data);
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

export async function getServerSideProps(context) {
  const { data } = await axios
    .get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        withCredentials: true,
        headers: context.req.headers,
      }
    )
    .catch((err) => {
      console.log(err.message);
    });

  console.log(appContext);

  return { props: { ...data } };
}

export default MyApp;
