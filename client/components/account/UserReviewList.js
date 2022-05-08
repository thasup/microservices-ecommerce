import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { Button, Col, Row, Table } from "react-bootstrap";

import CustomTooltip from "../common/CustomTooltip";
import Rating from "../common/Rating";

const UserReviewList = ({ myReviews, products }) => {
	return (
		<Row className="align-items-center">
			<Col>
				<Table striped bordered hover responsive className="table-sm">
					<thead>
						<tr>
							<th>ID</th>
							<th>PRODUCT</th>
							<th>MY RATING</th>
							<th>OVERALL RATING</th>
							<th>TITLE</th>
							<th>DATE</th>
							<th>TIME</th>
							<th>DETAILS</th>
						</tr>
					</thead>
					<tbody>
						{myReviews.map((review, index) => (
							<tr key={review.id}>
								<td>
									<CustomTooltip index={index} mongoId={review.id} />{" "}
								</td>
								<td>
									<Link
										href={`/products/[productId]`}
										as={`/products/${review.productId}`}
									>
										<a>
											{review.productTitle
												? review.productTitle
												: products.find(
														(product) => product.id === review.productId
												  )?.title}
										</a>
									</Link>
								</td>
								<td>
									<Rating value={review.rating} mobile={false} /> (
									{review.rating})
								</td>
								<td>
									<Rating
										value={
											products.find(
												(product) => product.id === review.productId
											)?.rating
										}
										mobile={false}
									/>
									(
									{
										products.find((product) => product.id === review.productId)
											?.rating
									}
									)
								</td>
								<td>{review.title}</td>
								<td>{review.createdAt.substring(0, 10)}</td>
								<td>
									{new Date(`${review.createdAt}`).toString().substring(16, 21)}
								</td>
								<td>
									<Link
										href={"/products/[productId]"}
										as={`/products/${review.productId}`}
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

export default UserReviewList;
