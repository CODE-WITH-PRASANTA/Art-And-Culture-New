import React, { useEffect, useRef, useState } from "react";
import {
  UserRound,
  UserRoundPlus,
  Mail,
  KeyRound,
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  MapPin,
  ChevronDown,
  LogIn,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  CircleCheck,
  CircleX,
  ArrowLeft,
  Sparkles,
  Inbox,
} from "lucide-react";


import logo from "../../assets/Art and Culture logo.webp";
import heroImage from "../../assets/my-account.webp";

import "./MyAccount.css";


const DEMO_MODE = true;

const USERS_KEY = "artCultureUsers";
const SESSION_KEY = "artCultureSession";
const CODE_LENGTH = 6;
const CODE_TTL_MS = 10 * 60 * 1000; // code valid for 10 minutes
const MAX_ATTEMPTS = 5;
const RESEND_SECONDS = 30;

/* ---------- small helpers ---------- */

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const normalizeEmail = (email) => email.trim().toLowerCase();

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch {
    return {};
  }
};

const saveUsers = (users) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* storage unavailable */
  }
};

const hashPassword = async (password, email) => {
  const data = `${email}::${password}`;
  try {
    if (window.crypto && window.crypto.subtle) {
      const buffer = await window.crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(data)
      );
      return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
  } catch {
    /* fall through */
  }
  return window.btoa(encodeURIComponent(data));
};

const generateCode = () => {
  try {
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    return String(100000 + (arr[0] % 900000));
  } catch {
    return String(Math.floor(100000 + Math.random() * 900000));
  }
};

const validatePassword = (password) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Password must include at least one letter and one number.";
  }
  return "";
};

const getStrength = (password) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1;
  return Math.max(score, 1);
};

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];

/* ==================================================================
   BACKEND (replace these with real API calls when you have a server)
================================================================== */

const apiRegister = async ({ firstName, lastName, email, location, password }) => {
  // Real version: POST /api/auth/register
  await wait(700);
  const users = getUsers();
  if (users[email]) {
    throw new Error("An account with this email already exists. Please sign in.");
  }
  users[email] = {
    firstName,
    lastName,
    email,
    location,
    passwordHash: await hashPassword(password, email),
    createdAt: Date.now(),
  };
  saveUsers(users);
  return { ok: true };
};

const apiLogin = async ({ email, password }) => {
  // Real version: POST /api/auth/login
  await wait(700);
  const user = getUsers()[email];
  if (!user) {
    throw new Error("No account found with this email. Please create an account.");
  }
  const hash = await hashPassword(password, email);
  if (hash !== user.passwordHash) {
    throw new Error("Incorrect password. Please try again or reset it.");
  }
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    location: user.location,
  };
};

const apiSendResetCode = async (email, code) => {
  // Real version: POST /api/auth/forgot-password  { email }
  // The server generates the code, emails it and stores it with an expiry.
  await wait(900);
  const user = getUsers()[email];
  if (!user) {
    // Note: a real server should usually give the same answer whether or
    // not the email exists, to avoid revealing which emails are registered.
    throw new Error(
      "We could not find an account with this email. Check the address or create an account."
    );
  }
  return { ok: true, code };
};

const apiResetPassword = async ({ email, newPassword }) => {
  // Real version: POST /api/auth/reset-password  { email, code, newPassword }
  await wait(800);
  const users = getUsers();
  if (!users[email]) {
    throw new Error("Account not found. Please start again.");
  }
  users[email].passwordHash = await hashPassword(newPassword, email);
  saveUsers(users);
  return { ok: true };
};

/* ==================================================================
   COPY
================================================================== */

const VIEW_CONTENT = {
  login: {
    badge: "Art & Culture Portal",
    title: "Welcome Back",
    text: "Sign in to manage your account, follow auctions and explore India's finest art and cultural heritage.",
    switchLabel: "Create Account",
    formTitle: "Sign In",
    formText: "Welcome back! Please sign in to your account.",
  },
  register: {
    badge: "Join Art & Culture",
    title: "Create Account",
    text: "Join our community of artists and collectors to bid, buy and celebrate art that tells a story.",
    switchLabel: "Back to Sign In",
    formTitle: "Create Account",
    formText: "Create your account to get started.",
  },
  forgot: {
    badge: "Account Recovery",
    title: "Forgot Password?",
    text: "No worries. Verify your email with a 6-digit code and choose a new password in a few quick steps.",
    switchLabel: "Back to Sign In",
    formTitle: "Reset Password",
    formText: "Enter your registered email to receive a 6-digit verification code.",
  },
};

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  location: "",
  password: "",
  confirmPassword: "",
};

const emptyOtp = () => Array(CODE_LENGTH).fill("");

/* ==================================================================
   COMPONENT
================================================================== */

const MyAccount = ({ onAuthSuccess }) => {
  const [view, setView] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState(initialForm);
  const [busy, setBusy] = useState(false);

  // reset-password flow: "email" -> "verify" -> "done"
  const [resetStep, setResetStep] = useState("email");
  const [resetSession, setResetSession] = useState(null); // { code, expiresAt, attempts }
  const [otp, setOtp] = useState(emptyOtp());
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef([]);

  const isLogin = view === "login";
  const isRegister = view === "register";
  const isForgot = view === "forgot";
  const isVerify = isForgot && resetStep === "verify";
  const isDone = isForgot && resetStep === "done";
  const content = VIEW_CONTENT[view];

  const showEmailField = !isVerify;
  const showPasswordField = !isForgot || isVerify;
  const showConfirmField = isRegister || isVerify;
  const showStrength =
    (isRegister || isVerify) && formData.password.length > 0;

  const strength = getStrength(formData.password);
  const passwordsFilled =
    formData.password.length > 0 && formData.confirmPassword.length > 0;
  const passwordsMatch = formData.password === formData.confirmPassword;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  // resend countdown
  useEffect(() => {
    if (countdown <= 0) return undefined;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // focus first code box when verify step opens
  useEffect(() => {
    if (isVerify) {
      const t = setTimeout(() => otpRefs.current[0]?.focus(), 350);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [isVerify]);

  const clearMessage = () => setMessage({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearMessage();
  };

  const resetFlow = () => {
    setResetStep("email");
    setResetSession(null);
    setOtp(emptyOtp());
    setCountdown(0);
  };

  const switchView = (next, notice = null) => {
    setView(next);
    setMessage(notice || { type: "", text: "" });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setBusy(false);
    resetFlow();
    setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
  };

  /* ---------- code boxes ---------- */

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    clearMessage();
    if (digit && index < CODE_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = emptyOtp();
    pasted.split("").forEach((d, i) => {
      next[i] = d;
    });
    setOtp(next);
    clearMessage();
    otpRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const fillDemoCode = () => {
    if (!resetSession) return;
    setOtp(resetSession.code.split(""));
    clearMessage();
  };

  /* ---------- reset password: send / resend code ---------- */

  const sendCode = async (isResend = false) => {
    const email = normalizeEmail(formData.email);
    setMessage({ type: "", text: "" });
    setBusy(true);

    try {
      const code = generateCode();
      await apiSendResetCode(email, code);

      setResetSession({
        code,
        expiresAt: Date.now() + CODE_TTL_MS,
        attempts: 0,
      });
      setOtp(emptyOtp());
      setResetStep("verify");
      setCountdown(RESEND_SECONDS);

      if (isResend) {
        setMessage({
          type: "success",
          text: "A new code has been sent. The old code no longer works.",
        });
        otpRefs.current[0]?.focus();
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Could not send the code. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  /* ---------- reset password: verify code + save new password ---------- */

  const verifyAndReset = async () => {
    const email = normalizeEmail(formData.email);
    const entered = otp.join("");

    if (!resetSession) {
      setMessage({
        type: "error",
        text: "Please request a new verification code.",
      });
      return;
    }

    if (Date.now() > resetSession.expiresAt) {
      setMessage({
        type: "error",
        text: "This code has expired. Please request a new one.",
      });
      return;
    }

    if (entered.length < CODE_LENGTH) {
      setMessage({
        type: "error",
        text: `Enter the ${CODE_LENGTH}-digit code sent to your email.`,
      });
      return;
    }

    if (entered !== resetSession.code) {
      const attempts = resetSession.attempts + 1;

      if (attempts >= MAX_ATTEMPTS) {
        resetFlow();
        setMessage({
          type: "error",
          text: "Too many incorrect attempts. Please request a new code.",
        });
        return;
      }

      setResetSession({ ...resetSession, attempts });
      setOtp(emptyOtp());
      otpRefs.current[0]?.focus();
      setMessage({
        type: "error",
        text: `Incorrect code. ${MAX_ATTEMPTS - attempts} ${
          MAX_ATTEMPTS - attempts === 1 ? "attempt" : "attempts"
        } left.`,
      });
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setMessage({ type: "error", text: passwordError });
      return;
    }

    if (!passwordsMatch) {
      setMessage({
        type: "error",
        text: "Passwords do not match. Please try again.",
      });
      return;
    }

    setBusy(true);
    try {
      await apiResetPassword({ email, newPassword: formData.password });
      setResetSession(null);
      setResetStep("done");
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Could not reset the password. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  /* ---------- sign in ---------- */

  const handleLogin = async () => {
    const email = normalizeEmail(formData.email);
    setBusy(true);
    clearMessage();

    try {
      const user = await apiLogin({ email, password: formData.password });

      try {
        const store = rememberMe ? localStorage : sessionStorage;
        store.setItem(SESSION_KEY, JSON.stringify(user));
      } catch {
        /* storage unavailable */
      }

      setMessage({
        type: "success",
        text: `Welcome back, ${user.firstName}! You are now signed in.`,
      });
      setFormData((prev) => ({ ...prev, password: "" }));

      if (typeof onAuthSuccess === "function") onAuthSuccess(user);
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Could not sign in. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  /* ---------- register ---------- */

  const handleRegister = async () => {
    const email = normalizeEmail(formData.email);

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setMessage({ type: "error", text: passwordError });
      return;
    }

    if (!passwordsMatch) {
      setMessage({
        type: "error",
        text: "Passwords do not match. Please try again.",
      });
      return;
    }

    setBusy(true);
    clearMessage();

    try {
      await apiRegister({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email,
        location: formData.location,
        password: formData.password,
      });

      setFormData({ ...initialForm, email });
      switchView("login", {
        type: "success",
        text: "Account created successfully. Please sign in.",
      });
      setFormData({ ...initialForm, email });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Could not create the account. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  /* ---------- submit router ---------- */

  const handleSubmit = (e) => {
    e.preventDefault();
    if (busy) return;

    if (isLogin) return handleLogin();
    if (isRegister) return handleRegister();
    if (isVerify) return verifyAndReset();
    return sendCode(false);
  };

  const handleResend = () => {
    if (countdown > 0 || busy) return;
    sendCode(true);
  };

  const headingText = isVerify
    ? `Enter the 6-digit code sent to ${normalizeEmail(
        formData.email
      )} and choose a new password.`
    : content.formText;

  const headingTitle = isVerify ? "Verify & Reset" : content.formTitle;

  return (
    <div className="MyAccount">
      <section className="MyAccount-container">
        <span className="MyAccount-bg-blob MyAccount-bg-blob--one" />
        <span className="MyAccount-bg-blob MyAccount-bg-blob--two" />

        <div className="MyAccount-card">
          {/* ============ LEFT: BRAND PANEL ============ */}
          <aside className="MyAccount-aside">
            <span className="MyAccount-orb MyAccount-orb--1" />
            <span className="MyAccount-orb MyAccount-orb--2" />
            <span className="MyAccount-orb MyAccount-orb--3" />
            <span className="MyAccount-orb MyAccount-orb--4" />

            <div className="MyAccount-brand">
              <img src={logo} alt="Art & Culture logo" />
              <div className="MyAccount-brand-text">
                <strong>Art &amp; Culture</strong>
                <small>Discover Art. Celebrate Culture.</small>
              </div>
            </div>

            <div className="MyAccount-aside-content" key={`aside-${view}`}>
              <span className="MyAccount-badge">{content.badge}</span>
              <h2>{content.title}</h2>
              <p>{content.text}</p>
            </div>

            <div className="MyAccount-art">
              <div className="MyAccount-art-ring" aria-hidden="true" />
              <figure className="MyAccount-art-frame">
                <div className="MyAccount-art-inner">
                  <img src={heroImage} alt="Art and culture showcase" />
                  <span className="MyAccount-art-shade" />
                  <span className="MyAccount-art-chip">
                    <Sparkles size={14} />
                    Curated art &amp; heritage
                  </span>
                </div>
              </figure>
            </div>

            <button
              type="button"
              className="MyAccount-aside-button"
              onClick={() => switchView(isLogin ? "register" : "login")}
            >
              {isLogin ? <UserRoundPlus size={18} /> : <ArrowLeft size={18} />}
              <span>{content.switchLabel}</span>
            </button>
          </aside>

          {/* ============ RIGHT: FORM PANEL ============ */}
          <div className="MyAccount-main">
            <div className="MyAccount-panel" key={`panel-${view}-${resetStep}`}>
              {/* ---------- RESET DONE ---------- */}
              {isDone ? (
                <div className="MyAccount-sent">
                  <div className="MyAccount-sent-icon">
                    <ShieldCheck size={36} />
                  </div>

                  <h1>Password updated</h1>
                  <p className="MyAccount-sent-text">
                    Your password has been changed for
                    <strong> {normalizeEmail(formData.email)}</strong>. You can
                    now sign in with your new password.
                  </p>

                  <button
                    type="button"
                    className="MyAccount-submit"
                    onClick={() =>
                      switchView("login", {
                        type: "success",
                        text: "Password reset successful. Sign in with your new password.",
                      })
                    }
                  >
                    <LogIn size={19} />
                    <span>Sign In Now</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="MyAccount-heading">
                    {isForgot && (
                      <div className="MyAccount-heading-icon">
                        {isVerify ? (
                          <ShieldCheck size={26} />
                        ) : (
                          <KeyRound size={26} />
                        )}
                      </div>
                    )}
                    <h1>{headingTitle}</h1>
                    <p>{headingText}</p>
                  </div>

                  <form
                    className="MyAccount-form"
                    onSubmit={handleSubmit}
                    noValidate={false}
                  >
                    {/* Demo inbox: shows the code because no backend emails it */}
                    {isVerify && DEMO_MODE && resetSession && (
                      <div className="MyAccount-demo">
                        <div className="MyAccount-demo-head">
                          <Inbox size={16} />
                          <span>Demo inbox</span>
                        </div>
                        <p>
                          No backend is connected, so the email is simulated.
                          Your verification code is:
                        </p>
                        <div className="MyAccount-demo-row">
                          <span className="MyAccount-demo-code">
                            {resetSession.code}
                          </span>
                          <button
                            type="button"
                            className="MyAccount-demo-use"
                            onClick={fillDemoCode}
                          >
                            Use this code
                          </button>
                        </div>
                      </div>
                    )}

                    {isRegister && (
                      <div className="MyAccount-name-row">
                        <div className="MyAccount-field">
                          <label htmlFor="MyAccount-firstName">
                            First Name
                          </label>
                          <div className="MyAccount-input-wrapper">
                            <UserRound size={18} />
                            <input
                              id="MyAccount-firstName"
                              type="text"
                              name="firstName"
                              placeholder="First name"
                              value={formData.firstName}
                              onChange={handleChange}
                              autoComplete="given-name"
                              disabled={busy}
                              required
                            />
                          </div>
                        </div>

                        <div className="MyAccount-field">
                          <label htmlFor="MyAccount-lastName">Last Name</label>
                          <div className="MyAccount-input-wrapper">
                            <UserRound size={18} />
                            <input
                              id="MyAccount-lastName"
                              type="text"
                              name="lastName"
                              placeholder="Last name"
                              value={formData.lastName}
                              onChange={handleChange}
                              autoComplete="family-name"
                              disabled={busy}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {showEmailField && (
                      <div className="MyAccount-field">
                        <label htmlFor="MyAccount-email">Email Address</label>
                        <div className="MyAccount-input-wrapper">
                          <Mail size={18} />
                          <input
                            id="MyAccount-email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            disabled={busy}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {isVerify && (
                      <div className="MyAccount-field">
                        <label htmlFor="MyAccount-otp-0">
                          Verification Code
                        </label>
                        <div
                          className="MyAccount-otp"
                          onPaste={handleOtpPaste}
                        >
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              id={`MyAccount-otp-${index}`}
                              ref={(el) => {
                                otpRefs.current[index] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={1}
                              value={digit}
                              className={digit ? "filled" : ""}
                              onChange={(e) =>
                                handleOtpChange(index, e.target.value)
                              }
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              onFocus={(e) => e.target.select()}
                              autoComplete={
                                index === 0 ? "one-time-code" : "off"
                              }
                              disabled={busy}
                              aria-label={`Digit ${index + 1} of ${CODE_LENGTH}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {isRegister && (
                      <div className="MyAccount-field">
                        <label htmlFor="MyAccount-location">Location</label>
                        <div className="MyAccount-input-wrapper">
                          <MapPin size={18} />
                          <select
                            id="MyAccount-location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            disabled={busy}
                            required
                          >
                            <option value="" disabled>
                              Select your location
                            </option>
                            <option value="Odisha">Odisha</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Other">Other</option>
                          </select>
                          <ChevronDown
                            size={17}
                            className="MyAccount-select-arrow"
                          />
                        </div>
                      </div>
                    )}

                    {showPasswordField && (
                      <div className="MyAccount-field">
                        <label htmlFor="MyAccount-password">
                          {isVerify ? "New Password" : "Password"}
                        </label>
                        <div className="MyAccount-input-wrapper">
                          <LockKeyhole size={18} />
                          <input
                            id="MyAccount-password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder={
                              isLogin
                                ? "Enter your password"
                                : isVerify
                                ? "Enter new password"
                                : "Create a password"
                            }
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete={
                              isLogin ? "current-password" : "new-password"
                            }
                            minLength={8}
                            disabled={busy}
                            required
                          />
                          <button
                            type="button"
                            className="MyAccount-password-toggle"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>

                        {showStrength && (
                          <div
                            className="MyAccount-strength"
                            data-level={strength}
                          >
                            <div className="MyAccount-strength-bars">
                              <span />
                              <span />
                              <span />
                              <span />
                            </div>
                            <small>{STRENGTH_LABELS[strength]}</small>
                          </div>
                        )}
                      </div>
                    )}

                    {showConfirmField && (
                      <div className="MyAccount-field">
                        <label htmlFor="MyAccount-confirmPassword">
                          {isVerify ? "Re-enter New Password" : "Confirm Password"}
                        </label>
                        <div className="MyAccount-input-wrapper">
                          <LockKeyhole size={18} />
                          <input
                            id="MyAccount-confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            minLength={8}
                            disabled={busy}
                            required
                          />
                          <button
                            type="button"
                            className="MyAccount-password-toggle"
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            aria-label={
                              showConfirmPassword
                                ? "Hide confirm password"
                                : "Show confirm password"
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>

                        {passwordsFilled && (
                          <p
                            className={`MyAccount-hint ${
                              passwordsMatch ? "ok" : "bad"
                            }`}
                          >
                            {passwordsMatch ? (
                              <>
                                <CircleCheck size={14} /> Passwords match
                              </>
                            ) : (
                              <>
                                <CircleX size={14} /> Passwords do not match
                              </>
                            )}
                          </p>
                        )}
                      </div>
                    )}

                    {isLogin && (
                      <div className="MyAccount-form-options">
                        <label className="MyAccount-remember">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                          />
                          <span>Remember Me</span>
                        </label>

                        <button
                          type="button"
                          className="MyAccount-forgot"
                          onClick={() => switchView("forgot")}
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}

                    {message.text && (
                      <div
                        className={`MyAccount-message ${message.type}`}
                        role="status"
                      >
                        {message.type === "error" ? (
                          <AlertCircle size={17} />
                        ) : (
                          <CheckCircle2 size={17} />
                        )}
                        <span>{message.text}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="MyAccount-submit"
                      disabled={busy}
                    >
                      {busy ? (
                        <>
                          <Loader2 size={19} className="MyAccount-spin" />
                          <span>
                            {isLogin && "Signing in..."}
                            {isRegister && "Creating account..."}
                            {isForgot && !isVerify && "Sending code..."}
                            {isVerify && "Resetting password..."}
                          </span>
                        </>
                      ) : isLogin ? (
                        <>
                          <LogIn size={19} />
                          <span>Sign In</span>
                        </>
                      ) : isRegister ? (
                        <>
                          <UserRoundPlus size={19} />
                          <span>Register</span>
                        </>
                      ) : isVerify ? (
                        <>
                          <KeyRound size={18} />
                          <span>Reset Password</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Send Verification Code</span>
                        </>
                      )}
                    </button>

                    {isVerify && (
                      <div className="MyAccount-reset-links">
                        <button
                          type="button"
                          className="MyAccount-link-button"
                          onClick={handleResend}
                          disabled={countdown > 0 || busy}
                        >
                          {countdown > 0
                            ? `Resend code in ${countdown}s`
                            : "Resend code"}
                        </button>

                        <button
                          type="button"
                          className="MyAccount-link-button"
                          onClick={() => {
                            resetFlow();
                            clearMessage();
                          }}
                          disabled={busy}
                        >
                          Change email
                        </button>
                      </div>
                    )}
                  </form>

                  <p className="MyAccount-footer">
                    <span>
                      {isLogin && "Don't have an account?"}
                      {isRegister && "Already have an account?"}
                      {isForgot && "Remembered your password?"}
                    </span>
                    <button
                      type="button"
                      onClick={() => switchView(isLogin ? "register" : "login")}
                    >
                      {isLogin ? "Create Account" : "Sign In"}
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyAccount;