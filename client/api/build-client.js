import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server

    return axios.create({
      baseURL: process.env.NODE_ENV === "production" ? "http://www.thasup.xyz" : "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
      withCredentials: true,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};
