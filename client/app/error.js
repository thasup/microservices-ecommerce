'use client';

export default function Error ({ error, reset }) {
  return (
    <p
      className="d-flex justify-content-center align-items-center"
      style={{ height: '90vh' }}
    >
      An error occurred on server
    </p>
  );
}
