import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";

import CustomTooltip from "./CustomTooltip";
import profilePic from "../public/asset/sample.jpg";

const UserList = ({ users }) => {
  // const deleteHandler = async (id) => {
  //   setLoading(true);
  //   await axios.delete(`/api/products/${id}`);
  //   setLoading(false);
  // };

  const myLoader = ({ src, width, quality }) => {
    return `${src}&w=${width}&q=${quality || 20}`;
  };

  return (
    <Row className="align-items-center">
      <Col>
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
                      <i
                        className="fas fa-check"
                        style={{ color: "green" }}
                      ></i>
                      {"  "}
                      Yes
                    </>
                  ) : (
                    <>
                      <i className="fas fa-times" style={{ color: "red" }}></i>
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
                        <i
                          className="fa-solid fa-mars"
                          style={{ color: "dodgerblue" }}
                        ></i>
                        {"  "}
                        Male
                      </>
                    ) : (
                      <>
                        <i
                          className="fa-solid fa-venus"
                          style={{ color: "hotpink" }}
                        ></i>
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
                    href={"/admin/user/[userId]"}
                    as={`/admin/user/${user.id}`}
                  >
                    <Button variant="dark" className="btn-sm mx-1">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="btn-sm mx-1"
                    onClick={() => deleteHandler(user._id)}
                  >
                    <i className="fas fa-trash"></i>
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
