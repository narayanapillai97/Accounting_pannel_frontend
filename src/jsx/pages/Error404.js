import React from "react";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="error-section">
      <div className="error-container">
        <div className="error-content">
          <div className="error-illustration">
            <div className="error-orb error-orb-1"></div>
            <div className="error-orb error-orb-2"></div>
            <div className="error-orb error-orb-3"></div>
            <div className="error-main">
              <div className="error-eyes">
                <div className="error-eye"></div>
                <div className="error-eye"></div>
              </div>
              <div className="error-mouth"></div>
            </div>
          </div>
          
          <h1 className="error-code">404</h1>
          <h2 className="error-heading">Page Not Found</h2>
          <p className="error-description">
            The page you're looking for seems to have wandered off into the digital void.
            Let's get you back to familiar territory.
          </p>
          
          <div className="error-actions">
            <Link className="error-button error-primary" to="/dashboard">
              Return to Dashboard
            </Link>
            <button className="error-button error-secondary" onClick={() => window.history.back()}>
              Go Back
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .error-section {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
          color: #2d3748;
        }
        
        .error-container {
          max-width: 600px;
          width: 100%;
          text-align: center;
        }
        
        .error-content {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
          position: relative;
          overflow: hidden;
        }
        
        .error-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg,#dc3545 0%, #c82333 100%);
        }
        
        .error-illustration {
          width: 180px;
          height: 180px;
          margin: 0 auto 30px;
          position: relative;
        }
        
        .error-main {
          width: 120px;
          height: 120px;
          background: #f8f9fa;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .error-eyes {
          display: flex;
          justify-content: space-around;
          width: 70%;
          margin-bottom: 15px;
        }
        
        .error-eye {
          width: 20px;
          height: 20px;
          background: #4a5568;
          border-radius: 50%;
          position: relative;
        }
        
        .error-eye::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          top: 4px;
          left: 4px;
        }
        
        .error-mouth {
          width: 40px;
          height: 10px;
          background: #4a5568;
          border-radius: 0 0 10px 10px;
        }
        
        .error-orb {
          position: absolute;
          border-radius: 50%;
          animation: float 4s ease-in-out infinite;
        }
        
        .error-orb-1 {
          width: 30px;
          height: 30px;
          background: rgba(102, 126, 234, 0.2);
          top: 10px;
          right: 20px;
          animation-delay: 0s;
        }
        
        .error-orb-2 {
          width: 20px;
          height: 20px;
          background: rgba(118, 75, 162, 0.2);
          bottom: 30px;
          left: 15px;
          animation-delay: 1.3s;
        }
        
        .error-orb-3 {
          width: 15px;
          height: 15px;
          background: rgba(102, 126, 234, 0.2);
          top: 60px;
          left: 10px;
          animation-delay: 2.7s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        .error-code {
          font-size: 120px;
          font-weight: 800;
          margin: 0 0 10px;
          background: linear-gradient(90deg, #dc3545 0%, #c82333 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
        }
        
        .error-heading {
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 15px;
          color: #2d3748;
        }
        
        .error-description {
          font-size: 16px;
          line-height: 1.6;
          color: #718096;
          margin: 0 0 30px;
        }
        
        .error-actions {
          display: flex;
          justify-content: center;
          gap: 15px;
        }
        
        .error-button {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }
        
        .error-primary {
          background: linear-gradient(90deg,#dc3545 0%, #c82333 100%);
          color: white;
          border: none;
        }
        
        .error-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 14px rgba(102, 126, 234, 0.4);
        }
        
        .error-secondary {
          background: transparent;
          color: #dc3545;
          border: 2px solid #c82333;
        }
        
        .error-secondary:hover {
          background: #f7fafc;
          transform: translateY(-2px);
        }
        
        @media (max-width: 576px) {
          .error-content {
            padding: 30px 20px;
          }
          
          .error-actions {
            flex-direction: column;
            gap: 10px;
          }
          
          .error-code {
            font-size: 100px;
          }
        }
      `}</style>
    </div>
  );
};

export default Error404;