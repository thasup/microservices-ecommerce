import Link from "next/link";
import React from "react";
import { Button, Col, Row, Table } from "react-bootstrap";

import CustomTooltip from "./CustomTooltip";
import ExpireTimer from "./ExpireTimer";

const UserOrderList = ({ orders }) => {
  return (
    <Row className="align-items-center">
      <Col>
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>DATE</th>
              <th>TIME</th>
              <th>TOTAL</th>
              <th>METHOD</th>
              <th>EXPIRE</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>
                  <CustomTooltip index={index} mongoId={order.id} />{" "}
                </td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.createdAt.substring(11, 16)}</td>
                <td>$ {order.totalPrice}</td>
                <td>
                  <p style={{ fontSize: "1rem" }}>
                    {order.paymentMethod === "paypal" ? (
                      <>
                        <i class="fa-brands fa-paypal"></i> PayPal
                      </>
                    ) : (
                      <>
                        <i class="fa-brands fa-stripe-s"></i> Stripe
                      </>
                    )}
                  </p>
                </td>
                <td>
                  {order.status === "cancelled" ? (
                    <p style={{ color: "red", fontWeight: "bolder" }}>
                      Expired
                    </p>
                  ) : order.status === "completed" ? (
                    <p style={{ color: "green", fontWeight: "bolder" }}>
                      Completed
                    </p>
                  ) : (
                    <>
                      <ExpireTimer order={order} />
                    </>
                  )}
                </td>
                <td>
                  {order.isPaid ? (
                    <p>
                      <i
                        className="fas fa-check"
                        style={{ color: "green" }}
                      ></i>{" "}
                      {order.paidAt?.substring(0, 10)}
                    </p>
                  ) : (
                    <p>
                      <i className="fas fa-times" style={{ color: "red" }}></i>{" "}
                      Not Paid
                    </p>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <p>
                      <i
                        className="fas fa-check"
                        style={{ color: "green" }}
                      ></i>{" "}
                      {order.deliveredAt.substring(0, 10)}
                    </p>
                  ) : (
                    <p>
                      <i className="fas fa-times" style={{ color: "red" }}></i>{" "}
                      Not Delivered
                    </p>
                  )}
                </td>
                <td>
                  <Link
                    href={"/orders/[orderId]"}
                    as={`/orders/${order.id}`}
                    passHref
                  >
                    <Button className="btn-sm" variant="light">
                      <i className="fas fa-info-circle"></i> Details
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default UserOrderList;
