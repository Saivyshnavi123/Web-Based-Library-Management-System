import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { apiPost,apiGet } from "../../api/ApiProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = React.useState("");

  const onSubmit = async (data) => {
    try {
      const response = await apiPost("/login", {
        username: data.lbusername,
        password: data.lbpassword,
      });
      sessionStorage.setItem('token', response?.token || '1234');
      sessionStorage.setItem("userid", response?.user_id);
      sessionStorage.setItem("role", response?.role);
      if (response?.user_id) {
        try {
          const userDetails = await apiGet(`/users/${response.user_id}`);
          if (userDetails?.username) {
            sessionStorage.setItem("username", userDetails.username);
          }
        } catch (err) {
          console.error("Failed to fetch user details", err);
        }
      }
      toast.success("Login successful!");
      setTimeout(() => {
        if (response?.role === "student") {
          navigate("/student/dashboard/cards", { replace: true });        
        } else if (response?.role === "librarian") {
          navigate("/admin/dashboard/cards", { replace: true });
        } else {
          navigate("/");
        }
      }, 1200);
    } catch (error) {
      setErrorMessage(error.message || "Invalid username or password.");
      toast.error(error.message || "Invalid username or password.");
    }
  };

  return (
    <div className="loginContainer">
      <ToastContainer position="top-center" />
      <form onSubmit={handleSubmit(onSubmit)} className="loginForm">
        <h1 className="loginTitle">Login</h1>
        <div>
          <label htmlFor="lbusername" className="loginLabel">
            Username:
          </label>
          <input
            id="lbusername"
            {...register("lbusername", { required: true })}
            type="text"
            className="loginInput"
          />
          {errors.lbusername && (
            <div className="loginError">Username is required.</div>
          )}
        </div>

        <div>
          <label htmlFor="lbpassword" className="loginLabel">
            Password:
          </label>
          <input
            id="lbpassword"
            {...register("lbpassword", { required: true })}
            type="password"
            className="loginInput"
          />
          {errors.lbpassword && (
            <div className="loginError">Password is required.</div>
          )}
        </div>

        <button
          type="submit"
          disabled={!!errors.lbusername || !!errors.lbpassword}
          className="loginSubmit"
        >
          Login
        </button>
        <Link className="loginLabel signIn" to="/register">
          Sign up
        </Link>
      </form>
      {errorMessage && (
        <p className="loginError">{errorMessage}</p>
      )}
    </div>
  );
}