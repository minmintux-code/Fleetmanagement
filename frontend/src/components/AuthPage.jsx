import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import FleetoraLogo from "../assets/FleetoraLogo";
import "./AuthPage.css";

const API = "http://localhost:8080/api";

export default function AuthPage({ onAuthSuccess }) {
  // Login State
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register State
  const [regFullName, setRegFullName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!loginUsername.trim() || !loginPassword) {
      setLoginError("Please enter both username/email and password.");
      return;
    }

    setLoginLoading(true);
    try {
      const response = await axios.post(`${API}/auth/login`, {
        username: loginUsername.trim(),
        password: loginPassword
      });

      if (response.data && response.data.token) {
        onAuthSuccess(response.data.token, response.data.user);
      } else {
        setLoginError("Unexpected login response. Please try again.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials or server unavailable.";
      setLoginError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Registration Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    if (!regFullName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword) {
      setRegError("Please fill out all required fields.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError("Passwords do not match.");
      return;
    }

    if (regPassword.length < 6) {
      setRegError("Password must be at least 6 characters long.");
      return;
    }

    setRegLoading(true);
    try {
      const response = await axios.post(`${API}/auth/register`, {
        fullName: regFullName.trim(),
        username: regUsername.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
        confirmPassword: regConfirmPassword
      });

      if (response.data && response.data.token) {
        setRegSuccess("Account created successfully! Logging you in...");
        setTimeout(() => {
          onAuthSuccess(response.data.token, response.data.user);
        }, 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setRegError(msg);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="fleetora-auth-container">
      {/* Background Animated Grid and Light Spheres */}
      <div className="auth-bg-grid"></div>
      <div className="auth-glow-sphere glow-1"></div>
      <div className="auth-glow-sphere glow-2"></div>
      <div className="auth-glow-sphere glow-3"></div>

      <div className="auth-content-wrapper">
        {/* HEADER SECTION WITH OFFICIAL LOGO */}
        <motion.div
          className="auth-header-section"
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="auth-logo-wrapper">
            <FleetoraLogo width={320} height={140} />
          </div>
          <p className="auth-tagline">
            Smart Fleet Operations & Tracking Platform
          </p>
          <div className="auth-badge">
            <ShieldCheck size={14} className="badge-icon" />
            <span>ENTERPRISE FLEET SECURITY PLATFORM</span>
          </div>
        </motion.div>

        {/* SIDE-BY-SIDE (DESKTOP) / STACKED (MOBILE) CARDS */}
        <div className="auth-cards-container">
          {/* LOGIN CARD */}
          <motion.div
            className="auth-card login-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="card-header">
              <div className="card-icon-box login-icon-box">
                <LogIn size={20} />
              </div>
              <div>
                <h2>Account Login</h2>
                <p>Access your fleet dashboard</p>
              </div>
            </div>

            {loginError && (
              <motion.div
                className="auth-alert alert-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </motion.div>
            )}

            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="login-user-input">Username or Email</label>
                <div className="input-field-wrapper">
                  <User size={18} className="field-icon" />
                  <input
                    id="login-user-input"
                    type="text"
                    placeholder="Enter username or email"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="login-pass-input">Password</label>
                <div className="input-field-wrapper">
                  <Lock size={18} className="field-icon" />
                  <input
                    id="login-pass-input"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    tabIndex={-1}
                  >
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn login-btn"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <>
                    <Loader2 size={18} className="spinner-icon" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>LOGIN</span>
                    <LogIn size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* REGISTER CARD */}
          <motion.div
            className="auth-card register-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <div className="card-header">
              <div className="card-icon-box register-icon-box">
                <UserPlus size={20} />
              </div>
              <div>
                <h2>Create Account</h2>
                <p>Register as fleet operations user</p>
              </div>
            </div>

            {regError && (
              <motion.div
                className="auth-alert alert-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <AlertCircle size={16} />
                <span>{regError}</span>
              </motion.div>
            )}

            {regSuccess && (
              <motion.div
                className="auth-alert alert-success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <CheckCircle2 size={16} />
                <span>{regSuccess}</span>
              </motion.div>
            )}

            <form onSubmit={handleRegisterSubmit} className="auth-form reg-grid-form">
              <div className="form-group full-width">
                <label htmlFor="reg-fullname-input">Full Name</label>
                <div className="input-field-wrapper">
                  <User size={18} className="field-icon" />
                  <input
                    id="reg-fullname-input"
                    type="text"
                    placeholder="John Doe"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-username-input">Username</label>
                <div className="input-field-wrapper">
                  <Sparkles size={18} className="field-icon" />
                  <input
                    id="reg-username-input"
                    type="text"
                    placeholder="johndoe"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-email-input">Email</label>
                <div className="input-field-wrapper">
                  <Mail size={18} className="field-icon" />
                  <input
                    id="reg-email-input"
                    type="email"
                    placeholder="john@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="reg-phone-input">Phone Number</label>
                <div className="input-field-wrapper">
                  <Phone size={18} className="field-icon" />
                  <input
                    id="reg-phone-input"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-pass-input">Password</label>
                <div className="input-field-wrapper">
                  <Lock size={18} className="field-icon" />
                  <input
                    id="reg-pass-input"
                    type={showRegPassword ? "text" : "password"}
                    placeholder="Create password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    tabIndex={-1}
                  >
                    {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-confirmpass-input">Confirm Password</label>
                <div className="input-field-wrapper">
                  <Lock size={18} className="field-icon" />
                  <input
                    id="reg-confirmpass-input"
                    type={showRegConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showRegConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="full-width">
                <button
                  type="submit"
                  className="auth-submit-btn register-btn"
                  disabled={regLoading}
                >
                  {regLoading ? (
                    <>
                      <Loader2 size={18} className="spinner-icon" />
                      <span>CREATING ACCOUNT...</span>
                    </>
                  ) : (
                    <>
                      <span>CREATE ACCOUNT</span>
                      <UserPlus size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* FOOTER */}
        <motion.div
          className="auth-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>© 2026 FLEETORA. All Rights Reserved. Smart Fleet Operations & Tracking Platform.</p>
        </motion.div>
      </div>
    </div>
  );
}
