import React, { useEffect } from "react";
import Router from "next/router";

import useRequest from "../hooks/use-request";
import Loader from "../components/Loader";

const signout = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center px-0">
      <Loader />
    </div>
  );
};

export default signout;
