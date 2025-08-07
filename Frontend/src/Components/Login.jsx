import React, { useState } from "react";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoginFormImg from "../assets/LoginPageImg.jpg";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const toggleForm = (e) => {
    e.preventDefault();
    setIsSignup(!isSignup);
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        await axios.post("http://localhost:3000/api/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        alert("Registration successful! Please log in.");
        setIsSignup(false);
      } else {
        const res = await axios.post("http://localhost:3000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* LEFT IMAGE SECTION */}
        <div className="col-lg-6 d-none d-lg-flex p-0 align-items-center justify-content-center">
          <img
            src={LoginFormImg}
            alt="Illustration"
            className="img-fluid rounded"
            style={{ maxWidth: "70%", maxHeight: "70%", objectFit: "contain" }}
          />
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="col-lg-6 loginContainer d-flex align-items-center justify-content-center">
          <div className="w-100 p-4" style={{ maxWidth: "400px" }}>
            <h2 className="fw-bold mb-2 text-center">
              {isSignup ? "Create an account" : "Welcome back"}
            </h2>
            <p className="text-muted mb-4 text-center">
              {isSignup ? "Fill in the details to sign up" : "Please enter your details"}
            </p>

            <Button
              variant="light"
              className="border w-100 mb-3 d-flex align-items-center justify-content-center"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                style={{ width: 20, marginRight: 8 }}
              />
              {isSignup ? "Continue with Google" : "Sign in with Google"}
            </Button>

            <div className="d-flex align-items-center my-3">
              <hr className="flex-grow-1" />
              <span className="px-2 text-muted">or</span>
              <hr className="flex-grow-1" />
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              {isSignup && (
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                  <InputGroup.Text
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer", background: "transparent", borderLeft: "none" }}
                  >
                    {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              {isSignup && (
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      required
                    />
                    <InputGroup.Text
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ cursor: "pointer", background: "transparent", borderLeft: "none" }}
                    >
                      {showConfirmPassword ? <IoIosEyeOff /> : <IoIosEye />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              )}

              {!isSignup && (
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Check type="checkbox" label="Remember for 30 days" />
                  <Link to="#" className="small text-muted" style={{ textDecoration: "none" }}>
                    Forgot password
                  </Link>
                </div>
              )}

              <Button variant="dark" type="submit" className="w-100">
                {isSignup ? "Sign up" : "Sign in"}
              </Button>
            </Form>

            <p className="text-center mt-3">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <button
                    className="btn btn-link text-success p-0"
                    onClick={toggleForm}
                    style={{ textDecoration: "none" }}
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <button
                    className="btn btn-link text-success p-0"
                    onClick={toggleForm}
                    style={{ textDecoration: "none" }}
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
