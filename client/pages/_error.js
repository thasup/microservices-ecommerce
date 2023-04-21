/* eslint-disable react/react-in-jsx-scope */
function Error ({ statusCode }) {
  return (
    <p
      className="d-flex justify-content-center align-items-center"
      style={{ height: '90vh' }}
    >
      {statusCode
        ? statusCode === 404
          ? '404 Page not found X('
          : `An error ${statusCode} occurred on server`
        : '404 Page not found :('}
    </p>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
