import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { loadingToggleAction, signupAction } from "../../store/actions/AuthActions";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import suyaplogo from "../../../src/images/logo/suyap_logo.jpeg";

function ModernRedRegister(props) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", username: "" });
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSignUp = (e) => {
    e.preventDefault();
    let error = false;
    const errorObj = { email: "", password: "", username: "" };

    if (!username) {
      errorObj.username = "Username is required";
      error = true;
    }

    if (!email) {
      errorObj.email = "Email is required";
      error = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errorObj.email = "Email is invalid";
      error = true;
    }

    if (!password) {
      errorObj.password = "Password is required";
      error = true;
    } else if (password.length < 6) {
      errorObj.password = "Password must be at least 6 characters";
      error = true;
    }

    setErrors(errorObj);
    if (error) return;

    dispatch(loadingToggleAction(true));
    dispatch(signupAction(email, password, username, navigate));
  };

  const primaryRed = "#dc3545";
  const darkRed = "#c82333";
  const lightRed = "#f8d7da";
  const grayBg = "#f8f9fa";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body, html, #root {
          height: 100%;
          font-family: 'Inter', sans-serif;
          background-color: ${grayBg};
        }
        
        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, ${primaryRed}15 0%, ${darkRed}15 100%);
          position: relative;
          overflow: hidden;
        }
        
        .register-container::before {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: linear-gradient(45deg, ${primaryRed}30, ${darkRed}30);
          top: -150px;
          left: -150px;
          filter: blur(40px);
        }
        
        .register-container::after {
          content: "";
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: linear-gradient(45deg, ${primaryRed}20, ${darkRed}20);
          bottom: -100px;
          right: -100px;
          filter: blur(40px);
        }
        
        .register-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 480px;
          padding: 2.5rem;
          position: relative;
          z-index: 10;
          overflow: hidden;
        }
        
        .card-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        
        .logo {
          height: 70px;
          width: auto;
        }
        
        .card-header h1 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }
        
        .card-header p {
          color: #718096;
          font-size: 1rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
          position: relative;
        }
        
        .input-with-icon {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          z-index: 2;
        }
        
        .form-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
          background-color: #f8f9fa;
        }
        
        .form-input:focus {
          outline: none;
          border-color: ${primaryRed};
          background-color: white;
          box-shadow: 0 0 0 3px ${primaryRed}20;
        }
        
        .form-input.error {
          border-color: ${primaryRed};
          background-color: ${lightRed};
        }
        
        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #a0aec0;
          cursor: pointer;
          z-index: 2;
        }
        
        .password-toggle:hover {
          color: ${primaryRed};
        }
        
        .error-message {
          color: ${primaryRed};
          font-size: 0.85rem;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          font-weight: 500;
        }
        
        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(to right, ${primaryRed}, ${darkRed});
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 1rem;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(220, 53, 69, 0.4);
        }
        
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .login-redirect {
          text-align: center;
          margin-top: 2rem;
          color: #718096;
          font-size: 0.95rem;
        }
        
        .login-redirect a {
          color: ${primaryRed};
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .login-redirect a:hover {
          text-decoration: underline;
        }
        
        .divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
          color: #a0aec0;
        }
        
        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background-color: #e2e8f0;
        }
        
        .divider span {
          padding: 0 1rem;
          font-size: 0.9rem;
        }
        
        .message {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .error-message-container {
          background-color: ${lightRed};
          color: ${primaryRed};
          border-left: 4px solid ${primaryRed};
        }
        
        .success-message-container {
          background-color: #d4edda;
          color: #155724;
          border-left: 4px solid #28a745;
        }
        
        @media (max-width: 576px) {
          .register-container {
            padding: 1rem;
          }
          
          .register-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      <div className="register-container">
        <div className="register-card">
          <div className="card-header">
            <div className="logo-container">
              <img src={suyaplogo} alt="Suyap Logo" className="logo" />
            </div>
            <h1>Create Your Account</h1>
          </div>
          
          <form onSubmit={onSignUp}>
            <div className="form-group">
              <div className="input-with-icon">
                <User size={20} className="input-icon" />
                <input
                  type="text"
                  className={`form-input ${errors.username ? 'error' : ''}`}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField("")}
                />
              </div>
              {errors.username && (
                <div className="error-message">
                  {errors.username}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <div className="input-with-icon">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                />
              </div>
              {errors.email && (
                <div className="error-message">
                  {errors.email}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <div className="input-with-icon">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <div className="error-message">
                  {errors.password}
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={props.showLoading}
            >
              {props.showLoading ? (
                <>
                  <div className="spinner"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  Sign Up <ArrowRight size={20} />
                </>
              )}
            </button>
            
            {props.errorMessage && (
              <div className="message error-message-container">
                {props.errorMessage}
              </div>
            )}
            
            {props.successMessage && (
              <div className="message success-message-container">
                {props.successMessage}
              </div>
            )}
          </form>
          
          <div className="login-redirect">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  errorMessage: state.auth.errorMessage,
  successMessage: state.auth.successMessage,
  showLoading: state.auth.showLoading,
});

export default connect(mapStateToProps)(ModernRedRegister);