function Error({ statusCode }) {
  return (
    <p
      className="d-flex justify-content-center align-items-center"
      style={{ height: "90vh" }}
    >
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
    </p>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
