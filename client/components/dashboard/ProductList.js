import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Table } from "react-bootstrap";

import useRequest from "../../hooks/use-request";
import ColorSelector from "../common/ColorSelector";
import CustomTooltip from "../common/CustomTooltip";
import SizeSelector from "../common/SizeSelector";

const ProductList = ({ products, orderProducts, paymentProducts }) => {
	const [deleteProductId, setDeleteProductId] = useState(null);
	const [loading, setLoading] = useState(false);

	const { doRequest, errors } = useRequest({
		url: `/api/products/${deleteProductId}`,
		method: "delete",
		body: {},
		onSuccess: () => {
			setLoading(false);
			Router.push("/admin");
		},
	});

	useEffect(() => {
		if (loading) {
			if (window.confirm("Are you sure?")) {
				doRequest();
			}
		}
	}, [loading]);

	const deleteHandler = (id) => {
		setDeleteProductId(id);
		setLoading(true);
	};

	return (
		<Row className="align-items-center">
			<Col>
				{errors}
				<Table striped bordered hover responsive className="table-sm">
					<thead>
						<tr>
							<th>ID</th>
							<th>NAME</th>
							<th>QTY</th>
							<th>PRICE</th>
							<th>COLOR</th>
							<th>SIZE</th>
							<th>CATEGORY</th>
							<th>BRAND</th>
							<th>MATERIAL</th>
							<th>REVIEW</th>
							<th>PRO VER.</th>
							<th>ORD VER.</th>
							<th>PAY VER.</th>
							<th>DETAILS</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product, index) => (
							<tr key={product.id}>
								<td>
									<CustomTooltip index={index} mongoId={product.id} />
								</td>
								<td>
									<Link
										href={`/products/[productId]`}
										as={`/products/${product.id}`}
									>
										<a>{product.title}</a>
									</Link>
								</td>
								<td>{product.countInStock}</td>
								<td>${product.price}</td>
								<td>
									<ColorSelector
										product={product}
										margin={"2px"}
										size={"1.5rem"}
										flex={"start"}
									/>
								</td>
								<td>
									<SizeSelector product={product} width={"1.2rem"} />
								</td>
								<td>{product.category}</td>
								<td>{product.brand}</td>
								<td>{product.material}</td>
								<td>{product.numReviews}</td>
								<td>{product.version}</td>
								<td>
									{orderProducts.find(
										(orderProduct) => orderProduct.id === product.id
									).version === product.version ? (
										<span style={{ color: "green" }}>OK</span>
									) : (
										<span style={{ color: "red" }}>
											{
												orderProducts.find(
													(orderProduct) => orderProduct.id === product.id
												).version
											}
										</span>
									)}
								</td>
								<td>
									{paymentProducts.find(
										(paymentProduct) => paymentProduct.id === product.id
									).version === product.version ? (
										<span style={{ color: "green" }}>OK</span>
									) : (
										<span style={{ color: "red" }}>
											{
												paymentProducts.find(
													(paymentProduct) => paymentProduct.id === product.id
												).version
											}
										</span>
									)}
								</td>
								<td>
									<Link
										href={`/products/edit/[productId]`}
										as={`/products/edit/${product.id}`}
										passHref
									>
										<Button variant="dark" className="btn-sm mx-1">
											<FontAwesomeIcon icon={faEdit} />
										</Button>
									</Link>
									<Button
										variant="danger"
										className="btn-sm mx-1"
										onClick={() => deleteHandler(product.id)}
									>
										{loading ? (
											<Spinner
												animation="border"
												role="status"
												as="span"
												size="sm"
												aria-hidden="true"
											>
												<span className="visually-hidden">Loading...</span>
											</Spinner>
										) : (
											<FontAwesomeIcon icon={faTrash} />
										)}
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Col>
		</Row>
	);
};

export default ProductList;
