import React, { useState } from "react";
import { Link } from "wouter";
import { api } from "@/lib/api";

const SignupPage: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      
      if (response.ok) {
        window.location.href = "/home";
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
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
          <h1>Join ShortsHub</h1>
          <p>
            Start your journey to viral content creation and seamless social
            media management
          </p>
        </div>
      </div>

      <div className="signup-section">
        <div className="container">
          <div className="signup-form">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    required 
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    required 
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span className="password-toggle" onClick={togglePassword}>
                    {passwordVisible ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-wrapper">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <span className="password-toggle" onClick={togglePassword}>
                    {passwordVisible ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>
              <div className="form-options">
                <label className="terms">
                  <input type="checkbox" required /> I agree to the Terms of Service
                </label>
              </div>
              <button type="submit" className="sign-up-btn">
                Create Account
              </button>
            </form>
            <div className="divider">
              <span>Or continue with</span>
            </div>
            <button
              className="google-btn"
              onClick={() => (window.location.href = "/api/login")}
            >
              <span>🔍</span> Continue with Google
            </button>
            <div className="login-link">
              Already have an account? <Link href="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: var(--color-bg-gradient);
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
          background: var(--color-header-bg);
          backdrop-filter: var(--color-header-blur);
          padding: 20px 0;
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .signup-section {
          background: white;
          padding: 60px 0;
          margin-top: -40px;
          border-radius: 20px 20px 0 0;
          box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
        }
        .signup-form {
          max-width: 450px;
          margin: 0 auto;
          padding: 40px;
          background: var(--color-form-bg);
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
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
          border-color: var(--color-primary);
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
        .sign-up-btn {
          width: 100%;
          padding: 15px;
          background: var(--color-btn-gradient);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .sign-up-btn:hover {
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
          background: var(--color-google-btn);
          color: #333;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .google-btn:hover {
          background: var(--color-google-btn-hover);
        }
        .login-link {
          text-align: center;
          margin-top: 25px;
          color: #666;
        }
        .login-link a {
          color: var(--color-link);
          text-decoration: none;
          font-weight: 600;
        }
        .login-link a:hover {
          text-decoration: underline;
        }
        .terms {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #666;
        }
        .terms input {
          width: auto;
        }
      `}</style>
    </div>
  );
};

export default SignupPage;
