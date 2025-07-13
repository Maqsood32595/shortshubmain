import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your login logic here (e.g., API call)
  };

  return (
    <>
      <div className="dev-notice">
        <div className="container">
          <p>
            🚧 Our web application is currently under development. We're working
            hard to bring you an exceptional experience. Thank you for your
            patience as we build something amazing!
          </p>
        </div>
      </div>

      <div className="header">
        <div className="container">
          <div className="header-content">
            <div>
              <div className="logo">ShortsHub</div>
              <div className="tagline">
                Create, schedule, and publish shorts everywhere
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero">
        <div className="container">
          <h1>Welcome back</h1>
          <p>
            Continue your journey to viral content creation and seamless social
            media management
          </p>
        </div>
      </div>

      <div className="login-section">
        <div className="container">
          <div className="login-form">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                  />
                  <span className="password-toggle" onClick={togglePassword}>
                    {passwordVisible ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" className="forgot-password">
                  Forgot password?
                </a>
              </div>
              <button type="submit" className="sign-in-btn">
                Sign in
              </button>
            </form>
            <div className="divider">
              <span>Or continue with</span>
            </div>
            <button 
              className="google-btn" 
              onClick={() => window.location.href = "/api/login"}
            >
              <span>🔍</span> Continue with Google
            </button>
            <div className="signup-link">
              Don't have an account? <a href="#">Sign up</a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(
            135deg,
            #e53e3e 0%,
            #9f7aea 50%,
            #bee3f8 100%
          );
          min-height: 100vh;
          color: #333;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .dev-notice {
          background: linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%);
          color: white;
          padding: 15px 0;
          text-align: center;
          font-weight: 500;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 20px 0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #e53e3e;
        }

        .tagline,
        .hero p {
          font-size: 18px;
          color: #666;
          margin-top: 5px;
        }

        .hero {
          padding: 80px 0;
          text-align: center;
          color: white;
        }

        .hero h1 {
          font-size: 56px;
          margin-bottom: 20px;
        }

        .login-section {
          background: white;
          padding: 60px 0;
          margin-top: -40px;
          border-radius: 20px 20px 0 0;
          box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
        }

        .login-form {
          max-width: 400px;
          margin: 0 auto;
          padding: 40px;
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #555;
        }

        .form-group input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #e53e3e;
        }

        .password-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #666;
        }

        .sign-in-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #e53e3e 0%, #9f7aea 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .sign-in-btn:hover {
          transform: translateY(-2px);
        }

        .divider {
          text-align: center;
          margin: 25px 0;
          color: #666;
        }

        .google-btn {
          width: 100%;
          padding: 15px;
          background: white;
          color: #333;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .google-btn:hover {
          background: #f8f9fa;
        }

        .signup-link {
          text-align: center;
          margin-top: 25px;
          color: #666;
        }

        .signup-link a {
          color: #e53e3e;
          text-decoration: none;
          font-weight: 600;
        }

        .signup-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
};

export default LoginPage;
