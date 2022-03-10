import React, { useEffect, useState } from "react";

const ExpireTimer = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order?.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    setTimeLeft(null);
  }

  return timeLeft === null ? <>Expired</> : <>{timeLeft} s</>;
};

// ExpireCounter.getInitialProps = async (context, client) => {
//   let { data } = await client
//     .get(`/api/orders/myorders`)
//     .catch((err) => console.log(err));

//   if (data === undefined) {
//     data = [];
//   }

//   return { orders: data };
// };

export default ExpireTimer;
