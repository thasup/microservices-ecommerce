import buildClient from "../api/build-client";
import styles from "../styles/Home.module.css";

const Home = ({ data, currentUser }) => {
  // const { currentUser } = data;
  console.log("I am in the component", currentUser);

  return currentUser ? (
    <h1>Hello, {currentUser?.email ?? "user"}</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

export async function getServerSideProps(context, client, currentUser) {
  // const client = buildClient(context);
  // const { data } = await client.get("/api/users/currentuser");

  // return { props: { data } };
  return { props: {} };
}

export default Home;
