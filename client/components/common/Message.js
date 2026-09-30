'use client';

import { Alert } from 'react-bootstrap';

const Message = ({ variant = 'info', children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

export default Message;
