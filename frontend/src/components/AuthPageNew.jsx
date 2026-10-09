import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  User, Lock, Mail, Phone, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2
} from "lucide-react";
import "./AuthPage.css";

const API = "http://localhost:8080/api";

export default function AuthPageNew({ onAuthSuccess }) {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!loginUsername.trim() || !loginPassword) {
      setError("Please enter both username/email and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/login`, {
        username: loginUsername.trim(),
        password: loginPassword
      });
      if (response.data && response.data.token) {
        onAuthSuccess(response.data.token, response.data.user);
      } else {
        setError("Unexpected login response. Please try again.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials or server unavailable.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!regFullName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword) {
      setError("Please fill out all required fields.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
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
        setSuccess("Account created successfully!");
        setTimeout(() => {
          onAuthSuccess(response.data.token, response.data.user);
        }, 1200);
      } else {
         setSuccess("Account created! Please log in.");
         setTimeout(() => setActiveTab("login"), 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    initial: { opacity: 0, x: prefersReducedMotion ? 0 : 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: prefersReducedMotion ? 0 : -20, transition: { duration: 0.2 } }
  };

  return (
    <div className="auth-page-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-branding">
          <motion.img 
             src="/fleetora-logo.svg" 
             alt="Fleetora Logo" 
             className="auth-logo"
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.2 }}
          />
          <h1 className="auth-title">FLEETORA</h1>
          <p className="auth-since">SINCE 2026</p>
          <p className="auth-tagline">Smart Fleet Operations & Tracking Platform</p>
        </div>

        <div className="auth-toggle-pill">
          <button 
             type="button"
             className={`toggle-btn ${activeTab === "login" ? "active" : ""}`}
             onClick={() => { setActiveTab("login"); setError(""); setSuccess(""); }}
          >
            LOGIN
            {activeTab === "login" && (
               <motion.div className="toggle-indicator" layoutId="activeTab" />
            )}
          </button>
          <button 
             type="button"
             className={`toggle-btn ${activeTab === "register" ? "active" : ""}`}
             onClick={() => { setActiveTab("register"); setError(""); setSuccess(""); }}
          >
            SIGN UP
            {activeTab === "register" && (
               <motion.div className="toggle-indicator" layoutId="activeTab" />
            )}
          </button>
        </div>

        {error && (
          <div className="auth-alert error" aria-live="assertive">
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="auth-alert success" aria-live="polite">
            <CheckCircle2 size={16} /> <span>{success}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === "login" ? (
            <motion.form 
               key="login" 
               variants={variants} 
               initial="initial" 
               animate="animate" 
               exit="exit"
               onSubmit={handleLoginSubmit} 
               className="auth-form"
            >
              <h2>Welcome Back</h2>
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <User size={18} />
                  <input
                    type="text"
                    placeholder="Email or Username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <Lock size={18} />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button type="button" className="show-hide-btn" onClick={() => setShowLoginPassword(!showLoginPassword)} tabIndex="-1">
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <Loader2 className="spinner" size={18} /> : "LOGIN"}
              </button>
              <div className="auth-links">
                <button type="button" className="text-link" onClick={() => alert("Please contact your administrator to reset your password.")}>Forgot Password?</button>
                <button type="button" className="text-link" onClick={() => { setActiveTab("register"); setError(""); }}>Don't have an account? Sign up now</button>
              </div>
            </motion.form>
          ) : (
            <motion.form 
               key="register" 
               variants={variants} 
               initial="initial" 
               animate="animate" 
               exit="exit"
               onSubmit={handleRegisterSubmit} 
               className="auth-form"
            >
              <h2>Create Account</h2>
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <User size={18} />
                  <input type="text" placeholder="Full Name" value={regFullName} onChange={(e) => setRegFullName(e.target.value)} required disabled={loading} />
                </div>
              </div>
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <User size={18} />
                  <input type="text" placeholder="Username" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} required disabled={loading} />
                </div>
              </div>
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <Mail size={18} />
                  <input type="email" placeholder="Email Address" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required disabled={loading} />
                </div>
              </div>
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <Phone size={18} />
                  <input type="tel" placeholder="Phone Number" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} disabled={loading} />
                </div>
              </div>
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <Lock size={18} />
                  <input type={showRegPassword ? "text" : "password"} placeholder="Password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required disabled={loading} />
                  <button type="button" className="show-hide-btn" onClick={() => setShowRegPassword(!showRegPassword)} tabIndex="-1">
                    {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <Lock size={18} />
                  <input type={showRegConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} required disabled={loading} />
                  <button type="button" className="show-hide-btn" onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)} tabIndex="-1">
                    {showRegConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <Loader2 className="spinner" size={18} /> : "CREATE ACCOUNT"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
