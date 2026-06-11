'use client';

import { useEffect, useState } from 'react';

const ExpireTimer = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order?.expiresAt) - new Date();
      const minutesLeft = Math.round(msLeft / (60 * 1000));
      setTimeLeft(minutesLeft < 0 ? null : minutesLeft);
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 60000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

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
