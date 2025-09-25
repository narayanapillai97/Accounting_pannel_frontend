import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ChevronRight } from "lucide-react";
import suyaplogo from "../../../src/images/logo/suyap_logo.jpeg";
import accountingImage from "../../../src/images/gallery/accounting_image.jpg";
import axios from "axios";
import { toast } from "react-toastify";

function AccountingLogin() {
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onLogin = async (e) => {
    e.preventDefault();
    let error = {};
    if (!email) error.email = "Email is required";
    if (!password) error.password = "Password is required";
    setErrors(error);

    if (Object.keys(error).length > 0) return;

    try {
      setLoading(true);

      // Call backend API
      const res = await axios.post("http://localhost:5008/authRoutes/login", {
        email,
        password,
      });

      const { token, user } = res.data;
     

      // Store in localStorage
      localStorage.setItem("authtoken", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful ✅");
    console.log(("Login successful ✅",localStorage.getItem("authtoken"),token));
     console.log("Full response:", res);
     console.log("Response data only:", res.data);
     console.log("Token:", res.data.token);
     console.log("User:", res.data.user);


      // Redirect to dashboard
      navigate("dashboard");
    } catch (err) {
      console.error("❌ Login failed:", err);
      let message = "Login failed. Try again.";
      if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        body, html, #root {
          margin: 0; padding: 0; height: 100%;
          font-family: 'Inter', sans-serif;
          background-color: #f8f9fa;
        }
        .login-container {
          display: flex;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }
        .left-panel {
          flex: 1;
          background: linear-gradient(rgba(220, 53, 69, 0.85), rgba(200, 35, 51, 0.9)), url(${accountingImage}) no-repeat center center/cover;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          color: white;
          position: relative;
        }
        .brand-content {
          text-align: center;
          max-width: 500px;
          z-index: 2;
        }
        .brand-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .brand-content p {
          font-size: 1.1rem;
          opacity: 0.9;
          line-height: 1.6;
        }
        .right-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: #fff;
        }
        .login-card {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          position: relative;
        }
        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .logo {
          height: 60px;
        }
        h2 {
          text-align: center;
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          color: #2d3748;
          font-weight: 700;
        }
        .subtitle {
          text-align: center;
          color: #718096;
          margin-bottom: 2rem;
          font-size: 1rem;
        }
        .input-group {
          margin-bottom: 1.5rem;
          position: relative;
        }
        .input-icon {
          position: absolute;
          top: 50%;
          left: 15px;
          transform: translateY(-50%);
          color: #a0aec0;
        }
        input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
          background: #f7fafc;
        }
        input:focus {
          border: 1px solid #dc3545;
          box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);
        }
        .toggle-password-btn {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: none;
          cursor: pointer;
          color: #a0aec0;
        }
        .error-text {
          color: #e53e3e;
          font-size: 0.85rem;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
        }
        .submit-btn {
          width: 100%;
          padding: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          background: linear-gradient(90deg, #dc3545, #c82333);
          color: white;
          margin-top: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }
        .submit-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .option-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          font-size: 0.9rem;
        }
        .checkbox-container {
          display: flex;
          align-items: center;
          color: #4a5568;
        }
        .checkbox-container input {
          width: auto;
          margin-right: 8px;
          padding: 0;
        }
        .option-row a {
          color: #dc3545;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }
        .option-row a:hover {
          color: #c82333;
          text-decoration: underline;
        }
        .signup-text {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.95rem;
          color: #718096;
        }
        .signup-text a {
          color: #dc3545;
          font-weight: 600;
          text-decoration: none;
          margin-left: 5px;
        }
        .signup-text a:hover {
          text-decoration: underline;
        }
        .decoration-circle {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(220, 53, 69, 0.1), rgba(200, 35, 51, 0.05));
          z-index: 0;
        }
        .circle-1 {
          top: -80px;
          right: -80px;
        }
        .circle-2 {
          bottom: -80px;
          left: -80px;
        }
        @media (max-width: 900px) {
          .login-container {
            flex-direction: column;
          }
          .left-panel {
            display: none;
          }
        }
      `}</style>

      <div className="login-container">
        {/* Left Branding Section */}
        <div className="left-panel">
          <div className="brand-content">
            <h1>Smart Accounting Portal</h1>
            <p>
              Streamline your financial operations with our comprehensive accounting solution. Manage invoices, track expenses, and generate reports all in one place.
            </p>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="right-panel">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>

          <form className="login-card" onSubmit={onLogin}>
            <div className="logo-container">
              <img src={suyaplogo} alt="Suyap Logo" className="logo" />
            </div>
            <h2>Welcome Back</h2>
            <p className="subtitle">Sign in to your accounting dashboard</p>

            {/* Email */}
            <div className="input-group">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="input-group">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <div className="option-row">
              <label className="checkbox-container">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ChevronRight size={20} />}
            </button>

            <p className="signup-text">
              Don't have an account? <Link to="/page-register">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default AccountingLogin;
