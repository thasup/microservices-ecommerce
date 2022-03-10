import axios from "axios";
import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";

import CustomTooltip from "./CustomTooltip";

const UserList = ({ users }) => {
  const deleteHandler = async (id) => {
    setLoading(true);
    await axios.delete(`/api/products/${id}`);
    setLoading(false);
  };

  return (
    <Row className="align-items-center">
      <Col>
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <CustomTooltip index={index} mongoId={user.id} />
                </td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td className="d-flex justify-content-center">
                  <Link
                    href={"/admin/user/[userId"}
                    as={`/admin/user/${user._id}`}
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
