import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Table } from "react-bootstrap";
import {
	faCheck,
	faEdit,
	faMars,
	faTimes,
	faTrash,
	faVenus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CustomTooltip from "../common/CustomTooltip";
import profilePic from "../../public/asset/sample.jpg";
import useRequest from "../../hooks/useRequest";

const UserList = ({ users }) => {
	const [userId, setUserId] = useState(false);
	const [loading, setLoading] = useState(false);

	const { doRequest, errors } = useRequest({
		url: `/api/users/${userId}`,
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

	const deleteHandler = async (id) => {
		setLoading(true);
		setUserId(id);
	};

	const myLoader = ({ src, width, quality }) => {
		if (src[0] === "v") {
			return `https://res.cloudinary.com/thasup/image/upload/${src}`;
		} else {
			return `${src}&q=${quality || 20}`;
		}
	};

	return (
		<Row className="align-items-center">
			<Col>
				{errors}
				<Table striped bordered hover responsive className="table-sm">
					<thead>
						<tr>
							<th>ID</th>
							<th>IMAGE</th>
							<th>NAME</th>
							<th>EMAIL</th>
							<th>ADMIN</th>
							<th>AGE</th>
							<th>GENDER</th>
							<th>ADDRESS</th>
							<th>CITY</th>
							<th>POSTALCODE</th>
							<th>COUNTRY</th>
							<th>DETAILS</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user, index) => (
							<tr key={user.id}>
								<td>
									<CustomTooltip index={index} mongoId={user.id} />
								</td>
								<td>
									{user.image ? (
										<div className="profile-img">
											<Image
												loader={myLoader}
												src={user.image}
												alt="profile image"
												width={150}
												height={150}
												layout="responsive"
											/>
										</div>
									) : (
										<div className="profile-img">
											<Image
												src={profilePic}
												alt="profile image"
												width={150}
												height={150}
												layout="responsive"
											/>
										</div>
									)}
								</td>
								<td>{user?.name}</td>
								<td>
									<a href={`mailto:${user.email}`}>{user.email}</a>
								</td>
								<td>
									{user.isAdmin ? (
										<>
											<FontAwesomeIcon
												icon={faCheck}
												style={{ color: "green" }}
											/>
											{"  "}
											Yes
										</>
									) : (
										<>
											<FontAwesomeIcon
												icon={faTimes}
												style={{ color: "red" }}
											/>
											{"  "}
											No
										</>
									)}
								</td>
								<td>{user.age ? user.age : null}</td>
								<td>
									{user.gender ? (
										user.gender === "male" ? (
											<>
												<FontAwesomeIcon
													icon={faMars}
													style={{ color: "dodgerblue" }}
												/>
												{"  "}
												Male
											</>
										) : (
											<>
												<FontAwesomeIcon
													icon={faVenus}
													style={{ color: "hotpink" }}
												/>
												{"  "}
												Female
											</>
										)
									) : null}
								</td>
								<td>
									{user.shippingAddress?.address
										? user.shippingAddress?.address
										: null}
								</td>
								<td>
									{user.shippingAddress?.city
										? user.shippingAddress?.city
										: null}
								</td>
								<td>
									{user.shippingAddress?.postalCode
										? user.shippingAddress?.postalCode
										: null}
								</td>
								<td>
									{user.shippingAddress?.country
										? user.shippingAddress?.country
										: null}
								</td>
								<td>
									<Link
										href={"/dashboard/edit/[userId]"}
										as={`/dashboard/edit/${user.id}`}
										passHref
									>
										<Button variant="dark" className="btn-sm mx-1">
											<FontAwesomeIcon icon={faEdit} />
										</Button>
									</Link>
									<Button
										variant="danger"
										className="btn-sm mx-1"
										onClick={() => deleteHandler(user.id)}
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

export default UserList;
