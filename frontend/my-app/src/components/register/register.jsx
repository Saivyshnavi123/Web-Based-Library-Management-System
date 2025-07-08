import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../../api/ApiProvider";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const navigate = useNavigate();

  const userType = "student";

  const onSubmit = async (data) => {
    if (!data.username || !data.email || !data.password || !data.confirmPassword) {
      setErrorMessage("All fields are required.");
      setSuccessMessage("");
      return;
    }
    if (data.password !== data.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setSuccessMessage("");
      return;
    }
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await apiPost("/register", {
        username: data.username,
        email: data.email,
        role: userType,
        password: data.password,
      });
      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setErrorMessage(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-bg">
      <div className="loginContainer">
        <form onSubmit={handleSubmit(onSubmit)} className="loginForm">
          <h1 className="loginTitle">Register</h1>
          <div>
            <label htmlFor="username" className="loginLabel">
              Username:
            </label>
            <input
              id="username"
              {...register("username", { required: true })}
              type="text"
              className="loginInput"
            />
            {errors.username && (
              <div className="loginError">Username is required.</div>
            )}
          </div>
          <div>
            <label htmlFor="email" className="loginLabel">
              Email:
            </label>
            <input
              id="email"
              {...register("email", {
                required: true,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              type="email"
              className="loginInput"
            />
            {errors.email && (
              <div className="loginError">
                {errors.email.message || "Email is required."}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="password" className="loginLabel">
              Password:
            </label>
            <input
              id="password"
              {...register("password", { required: true, minLength: 6 })}
              type="password"
              className="loginInput"
            />
            {errors.password && (
              <div className="loginError">Password (min 6 chars) is required.</div>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="loginLabel">
              Confirm Password:
            </label>
            <input
              id="confirmPassword"
              {...register("confirmPassword", { required: true })}
              type="password"
              className="loginInput"
            />
            {errors.confirmPassword && (
              <div className="loginError">Please confirm your password.</div>
            )}
          </div>
          <button
            type="submit"
            className="loginSubmit"
          >
            Register
          </button>
          {errorMessage && <p className="loginError">{errorMessage}</p>}
          {successMessage && <p className="loginLabel" style={{ color: '#388e3c', marginTop: '1rem' }}>{successMessage}</p>}
        </form>
      </div>
    </div>
  );
}