import { faPaypal, faStripeS } from "@fortawesome/free-brands-svg-icons";
import {
	faCheck,
	faInfoCircle,
	faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { Button, Col, Row, Table } from "react-bootstrap";

import CustomTooltip from "../common/CustomTooltip";
import ExpireTimer from "../common/ExpireTimer";

const UserOrderList = ({ myOrders }) => {
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
						{myOrders.map((order, index) => (
							<tr key={order.id}>
								<td>
									<CustomTooltip index={index} mongoId={order.id} />{" "}
								</td>
								<td>{order.createdAt.substring(0, 10)}</td>
								<td>
									{new Date(`${order.createdAt}`).toString().substring(16, 21)}
								</td>
								<td>$ {order.totalPrice}</td>
								<td>
									<p style={{ fontSize: "1rem" }}>
										{order.paymentMethod === "paypal" ? (
											<>
												<FontAwesomeIcon icon={faPaypal} /> PayPal
											</>
										) : (
											<>
												<FontAwesomeIcon icon={faStripeS} /> Stripe
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
											<FontAwesomeIcon
												icon={faCheck}
												style={{ color: "green" }}
											/>{" "}
											{order.paidAt?.substring(0, 10)}
										</p>
									) : (
										<p>
											<FontAwesomeIcon
												icon={faTimes}
												style={{ color: "red" }}
											/>{" "}
											Not Paid
										</p>
									)}
								</td>
								<td>
									{order.isDelivered ? (
										<p>
											<FontAwesomeIcon
												icon={faCheck}
												style={{ color: "green" }}
											/>{" "}
											{order.deliveredAt.substring(0, 10)}
										</p>
									) : (
										<p>
											<FontAwesomeIcon
												icon={faTimes}
												style={{ color: "red" }}
											/>{" "}
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
											<FontAwesomeIcon icon={faInfoCircle} /> Details
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
