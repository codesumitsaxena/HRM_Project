import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom'; 
import LoginFormImg from '../assets/LoginPageImg.jpg'



function Login() {
  const [isSignup, setIsSignup] = useState(false);

  const toggleForm = (e) => {
    e.preventDefault();
    setIsSignup(!isSignup);
  };
  const navigate = useNavigate();

const handleClick = () => {
  navigate('/dashboard');
};

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* LEFT IMAGE SECTION */}
        <div className="col-lg-6 d-none d-lg-flex p-0 align-items-center justify-content-center ">
          <img
            src={LoginFormImg}
            alt="Illustration"
            className="img-fluid  rounded"
            style={{
              maxWidth: "70%",
              maxHeight: "70%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="col-lg-6 bg-light d-flex align-items-center justify-content-center">
          <div className="w-100 p-4" style={{ maxWidth: "400px" }}>
            <h2 className="fw-bold mb-2 text-center">
              {isSignup ? "Create an account" : "Welcome back"}
            </h2>
            <p className="text-muted mb-4 text-center">
              {isSignup
                ? "Fill in the details to sign up"
                : "Please enter your details"}
            </p>

            {/* Google Button */}
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

            <Form>
              {isSignup && (
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" />
                </Form.Group>
              )}

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>

              {isSignup && (
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                  />
                </Form.Group>
              )}

              {!isSignup && (
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Check type="checkbox" label="Remember for 30 days" />
                  <Link to="/dashboard" className="small text-muted" style={{ textDecoration: "none" }}>
  Forgot password
</Link>

                </div>
              )}

              <Button
                variant="dark"
                type="submit"
                className="w-100"
              >
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
