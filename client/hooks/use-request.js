import axios from "axios";
import { useState } from "react";
import { Alert, ListGroup } from "react-bootstrap";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      console.log(err.response.data);
      // setErrors(
      //   <Alert variant="danger" className="mt-3 mb-0">
      //     <Alert.Heading>Ooops....</Alert.Heading>
      //     <ListGroup className="my-0">
      //       {err.response.data.errors.map((err) => (
      //         <ListGroup.Item key={err.message}>{err.message}</ListGroup.Item>
      //       ))}
      //     </ListGroup>
      //   </Alert>
      // );
    }
  };

  return { doRequest, errors };
};
