import React, { useEffect, useState } from "react";
import { Button, Form, Row, Spinner } from "react-bootstrap";

const Coupon = ({ callback }) => {
	const [discount, setDiscount] = useState("");
	const [discountFactor, setDiscountFactor] = useState(1);

	const [loading, setLoading] = useState(false);
	const [couponSuccess, setCouponSuccess] = useState(false);
	const [couponError, setCouponError] = useState(false);

	useEffect(() => {
		if (discountFactor && callback) {
			callback(discountFactor);
		}
	}, [discountFactor]);

	const applyCoupon = (e) => {
		e.preventDefault();
		setLoading(true);

		switch (discount) {
			case "free":
				setDiscountFactor(0);
				break;
			case "grandsale":
				setDiscountFactor(0.5);
				break;
			case "hotdeal":
				setDiscountFactor(0.75);
				break;
			default:
				setDiscountFactor(1);
		}

		if (
			discount === "free" ||
			discount === "grandsale" ||
			discount === "hotdeal"
		) {
			setCouponSuccess(true);
			setCouponError(false);
		} else {
			setCouponSuccess(false);
			setCouponError(true);
		}

		setLoading(false);
	};

	return (
		<Row className="px-3">
			{couponError && (
				<div className="px-0 py-2" style={{ color: "red" }}>
					{"The coupon code entered is not valid for this product"}
				</div>
			)}
			{couponSuccess ? (
				<div className="px-0 py-2">{`${discount} is applied`}</div>
			) : (
				<>
					<Form.Control
						className="coupon-text text-uppercase"
						type="text"
						placeholder="Enter Coupon"
						value={discount}
						onChange={(e) => setDiscount(e.target.value)}
					></Form.Control>
					<Button
						className="coupon-button"
						onClick={applyCoupon}
						type="button"
						variant="dark"
						placeholder="Enter Coupon"
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
							<>Apply</>
						)}
					</Button>
				</>
			)}
		</Row>
	);
};

export default Coupon;
