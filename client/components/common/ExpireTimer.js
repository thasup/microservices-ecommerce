import React, { useEffect, useState } from 'react';

const ExpireTimer = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order?.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / (60 * 1000)));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 60000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    setTimeLeft(null);
  }

  return timeLeft === null
    ? (
		<p style={{ color: 'red', fontWeight: 'bolder' }}>Expired</p>
      )
    : (
		<>
			<strong>{timeLeft}</strong> minutes
		</>
      );
};

export default ExpireTimer;
