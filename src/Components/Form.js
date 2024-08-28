import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";

export default function Form() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const validationErrors = {};

    // Validate email
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Email is not valid";
    }

    // Validate password
    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      validationErrors.password = "Password should be at least 6 characters";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    axios
      .post("http://localhost:8080/Form", formData)
      .then((res) => {
        if (res.data === "success") {
          navigate("/Task"); // Navigate to /Task on successful login
        } else {
          alert("No record exists");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      id="form"
      className="flex-1 w-full px-52 py-20 bg-white rounded-3xl border-2 border-gray-200 ml-40 items-center justify-center"
    >
      <h1 className="text-2xl font-bold text-center mb-4">Task Manager</h1>
      <p className="mt-4 text-lg font-medium text-gray-500">
        Welcome back! Please enter your details.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mt-8">
          <label className="text-lg font-medium">Email</label>
          <input
            type="email"
            name="email"
            className={`w-full p-4 mt-1 bg-transparent border-4 rounded-xl ${
              errors.email ? "border-red-500" : "border-gray-100"
            }`}
            placeholder="Enter your email"
            onChange={handleChange}
            autoComplete="off"
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </div>

        <div className="mt-8">
          <label className="text-lg font-medium">Password</label>
          <input
            type="password"
            name="password"
            className={`w-full p-4 mt-1 bg-transparent border-4 rounded-xl ${
              errors.password ? "border-red-500" : "border-gray-100"
            }`}
            placeholder="Enter your password"
            onChange={handleChange}
            autoComplete="off"
          />
          {errors.password && (
            <span className="text-red-500">{errors.password}</span>
          )}
        </div>

        <div className="mt-8 flex flex-col">
          {/* Sign In button */}
          <Link to="/Task">
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-8 flex justify-center items-center">
          <p className="font-medium text-base">Don't have an account?</p>

          <Link
            to="/Signup"
            className="text-violet-500 text-base font-medium ml-3"
          >
            <Button>Sign Up</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
