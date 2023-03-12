import axios from 'axios'
import React, { useState } from 'react'
import { Alert, ListGroup } from 'react-bootstrap'

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async (props = {}) => {
    try {
      setErrors(null)
      const response = await axios[method](url, { ...body, ...props })

      if (onSuccess) {
        onSuccess(response.data)
      }

      return response.data
    } catch (err) {
      if (typeof err.response.data !== 'string') {
        setErrors(
          <Alert variant="danger" className="mt-3 mb-0">
            <Alert.Heading>Ooops....</Alert.Heading>
            <ListGroup className="my-0">
              {err.response.data.errors.map((err) => (
                <ListGroup.Item key={err.message}>{err.message}</ListGroup.Item>
              ))}
            </ListGroup>
          </Alert>
        )
      } else {
        setErrors(
          <Alert variant="danger" className="mt-3 mb-0">
            <Alert.Heading>Ooops....</Alert.Heading>
            <ListGroup className="my-0">
              <ListGroup.Item>500 Internal Server Error</ListGroup.Item>
            </ListGroup>
          </Alert>
        )
      }
    }
  }

  return { doRequest, errors }
}
