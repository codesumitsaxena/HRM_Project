import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/forgot-password', {
        Email: email
      });

      if (response.data.success) {
        setSuccess(response.data.msg);
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/verify-otp', {
        Email: email,
        OTP: otp
      });

      if (response.data.success) {
        setSuccess(response.data.msg);
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/reset-password', {
        Email: email,
        OTP: otp,
        NewPassword: newPassword
      });

      if (response.data.success) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/forgot-password', {
        Email: email
      });

      if (response.data.success) {
        setSuccess("New OTP sent to your email!");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg" style={{ maxWidth: "450px", width: "100%" }}>
        <div className="card-body p-5">
          <h2 className="fw-bold mb-2 text-center">Reset Password</h2>
          <p className="text-muted mb-4 text-center">
            {step === 1 && "Enter your email to receive OTP"}
            {step === 2 && "Enter the 6-digit OTP sent to your email"}
            {step === 3 && "Create your new password"}
          </p>

          {/* Progress indicator */}
          <div className="d-flex justify-content-center mb-4">
            <div className="d-flex align-items-center">
              <div className={`rounded-circle ${step >= 1 ? 'bg-success' : 'bg-secondary'}`} 
                   style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                1
              </div>
              <div className={`mx-2 ${step >= 2 ? 'bg-success' : 'bg-secondary'}`} 
                   style={{ width: 40, height: 3 }}></div>
              <div className={`rounded-circle ${step >= 2 ? 'bg-success' : 'bg-secondary'}`} 
                   style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                2
              </div>
              <div className={`mx-2 ${step >= 3 ? 'bg-success' : 'bg-secondary'}`} 
                   style={{ width: 40, height: 3 }}></div>
              <div className={`rounded-circle ${step >= 3 ? 'bg-success' : 'bg-secondary'}`} 
                   style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                3
              </div>
            </div>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <Form onSubmit={handleRequestOTP}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </Form.Group>

              <Button 
                variant="dark" 
                type="submit" 
                className="w-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </Form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <Form onSubmit={handleVerifyOTP}>
              <Form.Group className="mb-3">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  required
                  disabled={isLoading}
                  maxLength={6}
                  style={{ letterSpacing: '5px', fontSize: '20px', textAlign: 'center' }}
                />
                <Form.Text className="text-muted">
                  Check your email for the OTP code
                </Form.Text>
              </Form.Group>

              <Button 
                variant="dark" 
                type="submit" 
                className="w-100 mb-2"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <Button 
                variant="link" 
                className="w-100 text-decoration-none"
                onClick={handleResendOTP}
                disabled={isLoading}
              >
                Resend OTP
              </Button>
            </Form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <Form onSubmit={handleResetPassword}>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                  />
                  <span 
                    className="input-group-text" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
                  </span>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    disabled={isLoading}
                  />
                  <span 
                    className="input-group-text" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ cursor: 'pointer' }}
                  >
                    {showConfirmPassword ? <IoIosEyeOff /> : <IoIosEye />}
                  </span>
                </div>
              </Form.Group>

              <Button 
                variant="dark" 
                type="submit" 
                className="w-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </Form>
          )}

          <div className="text-center mt-3">
            <Button
              variant="link"
              className="text-decoration-none"
              onClick={() => navigate('/')}
              disabled={isLoading}
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;