import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  const logInDemoUser = (e) => {
    e.preventDefault()

    // setCredential("demo@user.io")
    // setPassword("password")
    return dispatch(sessionActions.login({ credential: "demo@user.io", password: "password" }))
      .then(closeModal)
  }

  return (
    <>
      <h1 className="login-header">Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label className="login-input-with-label">
          <input
            className="login-input"
            placeholder="Username or Email"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className="login-input-with-label">
          <input
            className="login-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <div className="demo-login-buttons">
          <button className="login-user-button" type="submit">Log In</button>
          <button className="demo-user-button" type="submit" onClick={logInDemoUser}>Demo-User</button>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;
