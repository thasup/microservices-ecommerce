import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";

const MyApp = (props) => {
  const { Component, pageProps, currentUser } = props;

  return (
    <>
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </>
  );
};

export default MyApp;
