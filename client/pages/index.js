import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home = ({ data }) => {
  const { currentUser } = data;
  console.log("I am in the component", currentUser);

  console.log(currentUser);

  return currentUser ? (
    <h1>Hello, {currentUser?.email ?? "user"}</h1>
  ) : (
    <h1>You are NOT signed in</h1>
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

  console.log(data);

  return { props: { data } };
}

export default Home;
