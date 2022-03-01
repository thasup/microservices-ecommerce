import Link from "next/link";
import { useState } from "react";
import { Alert, ListGroup } from "react-bootstrap";

export default ({ currentUser, onSuccess }) => {
  const [authorized, setAuthorized] = useState(false);
  const [errors, setErrors] = useState(null);

  const doAuthorized = async () => {
    try {
      setErrors(null);

      if (currentUser.isAdmin) {
        setAuthorized(true);
      }

      if (onSuccess) {
        onSuccess(authorized);
      }

      return authorized;
    } catch (err) {
      setErrors(
        <Alert variant="danger" className="mt-3 mb-0">
          <Alert.Heading>Not Authorized</Alert.Heading>
          <ListGroup className="my-0">
            <ListGroup.Item>{err.message}</ListGroup.Item>
          </ListGroup>
          <Link href="/" passHref>
            <a type="button" className="btn btn-outline-dark my-3">
              Back To Home
            </a>
          </Link>
        </Alert>
      );
    }
  };

  return { doAuthorized, errors };
};
