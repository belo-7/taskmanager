import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!formData.username.trim()) {
      validationErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Email is not valid";
    }

    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      validationErrors.password = "Password should be at least 6 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      axios
        .post("http://localhost:8082/Signup", formData)
        .then((res) => {
          console.log("Registered successfully!");
        })
        .catch((err) => {
          console.log("Error response:", err.response);
          if (err.response && err.response.status === 400) {
            const serverError = err.response.data.error;
            console.log("Server Error:", serverError);

            if (serverError === "Email already exists") {
              setErrors((prevErrors) => ({
                ...prevErrors,
                email: serverError, // Set the specific email error
              }));
            }
          } else {
            console.log(err);
          }
        });
    }
  };

  return (
    <div
      id="/signup"
      className="flex-1 w-full px-52 py-20 h-full bg-white rounded-3xl border-2 border-gray-200 ml-40 min-h-screen items-center justify-center"
    >
      <h2 className="text-3xl mb-4 font-medium">Signup</h2>
      <p className="mt-4 mb-4 text-lg font-medium text-gray-500">
        Create your account
      </p>
      <form action="#" onSubmit={handleSubmit}>
        <div className="font-medium text-base">
          <input
            type="text"
            name="username"
            placeholder="User Name"
            className="border border-gray-500 py-1 px-2 w-80"
            onChange={handleChange}
          />
          {errors.username && (
            <span className="text-red-500">{errors.username}</span>
          )}
        </div>

        <div className="mt-3 font-medium text-base">
          <input
            type="email"
            name="email"
            placeholder="email"
            className="border border-gray-500 py-1 px-2 w-80"
            onChange={handleChange}
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </div>
        <div className="mt-3 font-medium text-base">
          <input
            type="password"
            name="password"
            placeholder="password"
            className="border border-gray-500 py-1 px-2 w-80"
            onChange={handleChange}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password}</span>
          )}
        </div>
        <div className="mt-3 font-medium text-base">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="border border-gray-500 py-1 px-2 w-80"
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span className="text-red-500">{errors.confirmPassword}</span>
          )}
        </div>
        <div className="mt-5 font-medium text-base">
          <Button
            type="submit"
            className="w-full bg-violet-500 py-3 text-center text-white"
          >
            Register Now
          </Button>
        </div>
        <div className="mt-8 flex justify-center items-center">
          <p className="flex font-medium text-base">Do you have an account?</p>

          <Link to="/" className="text-violet-500 text-base font-medium ml-3">
            <Button>Signin</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
