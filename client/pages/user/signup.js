import React, { useState } from "react";
import axios from "axios";

import styles from "../../styles/signup.module.css";

const signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/users/signup", {
        email,
        password,
      });

      console.log(response.data);
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  };

  return (
    <div className="row">
      <div className="col-8">
        <form className={styles.signup} onSubmit={submitHandler}>
          <h1>Sign Up</h1>
          <div className="form-group">
            <label>Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
            />
          </div>
          {errors}
          <button className="btn btn-primary">Sign Up</button>
        </form>
      </div>
      <div className="col-4"></div>
    </div>
  );
};

export default signup;
