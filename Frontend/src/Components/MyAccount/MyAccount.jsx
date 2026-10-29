import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
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
  LogIn,
  LogOut,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Heart,
  Phone,
  Calendar,
  Save,
  Package,
  LayoutDashboard,
  Plus,
  Trash2,
  Edit3,
  Building,
  Home,
  Briefcase,
  ArrowRight,
  ExternalLink,
  Check,
  X,
  Camera,
  Download,
} from "lucide-react";

import logo from "../../assets/Art and Culture logo.webp";
import heroImage from "../../assets/my-account.webp";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { downloadInvoicePdf } from "../../utils/generateInvoice";
import { fetchMyOrders } from "../../services/razorpay";
import { formatImageUrl, WHATSAPP_NUMBER, getWhatsAppUrl } from "../../config/api";

import "./MyAccount.css";

const CODE_LENGTH = 6;
const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_SECONDS = 30;

const normalizeEmail = (email) => email.trim().toLowerCase();

const validatePassword = (password) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  return "";
};

const getStrength = (password) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(Math.max(score, 1), 4);
};

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];

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

const MyAccount = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";
  const setTab = (tab) => setSearchParams({ tab });

  const redirectTarget =
    searchParams.get("redirect") || location.state?.from || null;

  const {
    user,
    accessToken,
    isAuthenticated,
    loading: authLoading,
    login,
    googleLogin,
    register,
    logout,
    forgotPassword,
    verifyOtp,
    resetPassword,
    updateProfile,
    uploadAvatar,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAuth();

  const { wishlist = [], wishlistCount, removeFromWishlist, clearWishlist } = useWishlist();
  const { cart = [], cartCount, subtotal = 0, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleAccountLogout = async () => {
    await logout();
    setView("login");
    clearMessage();
    setFormData(initialForm);
    navigate("/my-account", { replace: true, state: null });
  };

  const [view, setView] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  // Google OAuth callback listener (in case of redirect flow)
  useEffect(() => {
    const code = searchParams.get("code");
    if (code && !isAuthenticated) {
      const exchangeGoogleCode = async () => {
        setGoogleBusy(true);
        try {
          await googleLogin(
            {
              code,
              redirect_uri: `${window.location.origin}/my-account`,
            },
            rememberMe
          );
          setMessage({
            type: "success",
            text: "Welcome! Signed in with Google successfully.",
          });
          navigate("/my-account", { replace: true });
        } catch (err) {
          console.error("Google sign-in error:", err);
          setMessage({
            type: "error",
            text: err.message || "Failed to sign in with Google",
          });
          navigate("/my-account", { replace: true });
        } finally {
          setGoogleBusy(false);
        }
      };
      exchangeGoogleCode();
    }
  }, [searchParams, isAuthenticated, rememberMe]);

  const handleGoogleSignIn = () => {
    clearMessage();
    const GOOGLE_CLIENT_ID =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      "1070313248799-q3r7khugifnf6rr69nh7uhpmucaeurq0.apps.googleusercontent.com";

    // 1. Preferred GIS Token Client Popup (No redirect URI required - eliminates redirect_uri_mismatch)
    if (window.google?.accounts?.oauth2?.initTokenClient) {
      try {
        setGoogleBusy(true);
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "email profile openid",
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                await googleLogin(
                  { access_token: tokenResponse.access_token },
                  rememberMe
                );
                setMessage({
                  type: "success",
                  text: "Welcome! Signed in with Google successfully.",
                });
              } catch (err) {
                console.error("Google sign-in error:", err);
                setMessage({
                  type: "error",
                  text: err.message || "Failed to sign in with Google",
                });
              } finally {
                setGoogleBusy(false);
              }
            } else {
              setGoogleBusy(false);
            }
          },
          error_callback: (err) => {
            console.warn("Google token client error:", err);
            setGoogleBusy(false);
          },
        });
        client.requestAccessToken({ prompt: "select_account" });
        return;
      } catch (err) {
        console.warn("Token client popup failed, attempting code client:", err);
      }
    }

    // 2. GIS Code Client Popup (postmessage redirect_uri)
    if (window.google?.accounts?.oauth2?.initCodeClient) {
      try {
        setGoogleBusy(true);
        const client = window.google.accounts.oauth2.initCodeClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "email profile openid",
          ux_mode: "popup",
          callback: async (response) => {
            if (response && response.code) {
              try {
                await googleLogin(
                  { code: response.code, redirect_uri: "postmessage" },
                  rememberMe
                );
                setMessage({
                  type: "success",
                  text: "Welcome! Signed in with Google successfully.",
                });
              } catch (err) {
                console.error("Google code sign-in error:", err);
                setMessage({
                  type: "error",
                  text: err.message || "Failed to sign in with Google",
                });
              } finally {
                setGoogleBusy(false);
              }
            } else {
              setGoogleBusy(false);
            }
          },
          error_callback: (err) => {
            console.warn("Google code client error:", err);
            setGoogleBusy(false);
          },
        });
        client.requestCode();
        return;
      } catch (err) {
        console.warn("Code client popup failed, falling back to redirect:", err);
      }
    }

    // 3. Direct OAuth 2.0 Full-Page Redirect Fallback
    const redirectUri = `${window.location.origin}/my-account`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      GOOGLE_CLIENT_ID
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${encodeURIComponent(
      "email profile openid"
    )}&access_type=offline&prompt=select_account`;

    window.location.href = googleAuthUrl;
  };

  // Profile editing state
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    phone: "",
  });
  const [profileNotice, setProfileNotice] = useState("");
  const [profileBusy, setProfileBusy] = useState(false);

  // Avatar upload state
  const avatarInputRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileNotice("Please select a valid image file (JPG, PNG, or WebP).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setProfileNotice("File size exceeds 15MB. Please choose a smaller image.");
      return;
    }

    // Instant local preview
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      setUploadingAvatar(true);
      setProfileNotice("");
      const res = await uploadAvatar(file);
      setProfileNotice(res?.message || "Profile photo uploaded and saved successfully!");
      setAvatarPreview(null);
      setTimeout(() => setProfileNotice(""), 4000);
    } catch (err) {
      console.error("Avatar upload failed:", err);
      setProfileNotice(err?.message || "Failed to upload profile photo.");
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!window.confirm("Are you sure you want to remove your profile photo?")) {
      return;
    }
    try {
      setUploadingAvatar(true);
      setProfileNotice("");
      await updateProfile({ avatar: "" });
      setProfileNotice("Profile photo removed successfully.");
      setAvatarPreview(null);
      setTimeout(() => setProfileNotice(""), 4000);
    } catch (err) {
      console.error("Failed to remove avatar:", err);
      setProfileNotice(err?.message || "Failed to remove profile photo.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Address management state
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressNotice, setAddressNotice] = useState({ type: "", text: "" });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    addressType: "Home",
    isDefault: false,
  });

  // Orders state (loaded live from backend with Razorpay order details)
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);
  const [downloadingOrderId, setDownloadingOrderId] = useState(null);

  const handleDownloadOrderInvoice = async (e, ord) => {
    e.stopPropagation();
    const ordId = ord.orderNumber || ord.id || ord._id;
    if (downloadingOrderId) return;
    if ((ord?.status || "").trim().toLowerCase() !== "delivered") {
      alert("Tax invoice is available for download only after the order has been delivered.");
      return;
    }
    try {
      setDownloadingOrderId(ordId);
      await downloadInvoicePdf(ord);
    } catch (err) {
      console.error("Failed to generate invoice PDF:", err);
      alert(err.message || "Unable to generate invoice PDF right now. Please try again.");
    } finally {
      setDownloadingOrderId(null);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadOrders = async () => {
      const token =
        accessToken ||
        localStorage.getItem("art_culture_access_token") ||
        sessionStorage.getItem("art_culture_access_token");
      if (!isAuthenticated && !token) {
        setOrders([]);
        return;
      }
      if (!token) return;
      try {
        setOrdersLoading(true);
        const data = await fetchMyOrders(token);
        if (isMounted) {
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to load user orders:", err);
      } finally {
        if (isMounted) {
          setOrdersLoading(false);
        }
      }
    };
    loadOrders();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, accessToken]);

  // Reset-password flow: "email" -> "otp" -> "new_password" -> "done"
  const [resetStep, setResetStep] = useState("email");
  const [resetSession, setResetSession] = useState(null);
  const [verifiedCode, setVerifiedCode] = useState("");
  const [otp, setOtp] = useState(emptyOtp());
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef([]);

  // Sync user addresses
  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && getAddresses) {
      getAddresses()
        .then((addrs) => {
          if (addrs) setAddresses(addrs);
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Open add-address form automatically if redirected with ?tab=addresses&add=true
  useEffect(() => {
    if (
      currentTab === "addresses" &&
      (searchParams.get("add") === "true" || location.state?.openAdd)
    ) {
      setShowAddressForm(true);
      setEditingAddressId(null);
    }
  }, [currentTab, searchParams, location.state]);

  const isLogin = view === "login";
  const isRegister = view === "register";
  const isForgot = view === "forgot";
  const isForgotEmail = isForgot && resetStep === "email";
  const isForgotOtp = isForgot && resetStep === "otp";
  const isForgotNewPass = isForgot && resetStep === "new_password";
  const isForgotDone = isForgot && resetStep === "done";
  const isDone = isForgotDone;
  const content = VIEW_CONTENT[view] || VIEW_CONTENT.login;

  const showEmailField = isLogin || isRegister || isForgotEmail;
  const showOtpField = isForgotOtp;
  const showPasswordField = isLogin || isRegister || isForgotNewPass;
  const showConfirmField = isRegister || isForgotNewPass;
  const showStrength =
    (isRegister || isForgotNewPass) && formData.password.length > 0;

  const strength = getStrength(formData.password);
  const passwordsFilled =
    formData.password.length > 0 && formData.confirmPassword.length > 0;
  const passwordsMatch = formData.password === formData.confirmPassword;

  // Hydrate profile form when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        location: user.location || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  // Show checkout notification message if redirected from cart/checkout
  useEffect(() => {
    if (!user && (location.state?.message || redirectTarget)) {
      setMessage({
        type: "info",
        text:
          location.state?.message ||
          "Please sign in or create an account to proceed to checkout.",
      });
    }
  }, []);

  // Resend countdown
  useEffect(() => {
    if (countdown <= 0) return undefined;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Focus first code box when verify OTP step opens
  useEffect(() => {
    if (isForgotOtp) {
      const t = setTimeout(() => otpRefs.current[0]?.focus(), 350);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [isForgotOtp]);

  const clearMessage = () => setMessage({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearMessage();
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetFlow = () => {
    setResetStep("email");
    setResetSession(null);
    setVerifiedCode("");
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

  /* ---------- reset password: step 1 - send otp ---------- */
  const handleSendOtp = async (isResend = false) => {
    const email = normalizeEmail(formData.email);
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address." });
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: "error", text: "Please provide a valid email address." });
      return;
    }

    setMessage({ type: "", text: "" });
    setBusy(true);

    try {
      const data = await forgotPassword(email);

      setResetSession({
        expiresAt: Date.now() + CODE_TTL_MS,
        attempts: 0,
      });
      setOtp(emptyOtp());
      setResetStep("otp");
      setCountdown(RESEND_SECONDS);
      clearMessage();
      setTimeout(() => otpRefs.current[0]?.focus(), 350);
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "We could not find an account with this email. Please check and try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  /* ---------- reset password: step 2 - verify otp ---------- */
  const handleVerifyOtp = async () => {
    const email = normalizeEmail(formData.email);
    const entered = otp.join("");

    if (entered.length < CODE_LENGTH) {
      setMessage({
        type: "error",
        text: `Please enter the complete ${CODE_LENGTH}-digit verification code.`,
      });
      return;
    }

    setMessage({ type: "", text: "" });
    setBusy(true);

    try {
      await verifyOtp({ email, code: entered });
      setVerifiedCode(entered);
      setResetStep("new_password");
      clearMessage();
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Invalid or expired verification code. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  /* ---------- reset password: step 3 - set new password ---------- */
  const handleSetNewPassword = async () => {
    const email = normalizeEmail(formData.email);
    const code = verifiedCode || otp.join("");

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

    setMessage({ type: "", text: "" });
    setBusy(true);

    try {
      await resetPassword({
        email,
        code,
        newPassword: formData.password,
      });
      setResetSession(null);
      setResetStep("done");
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      setMessage({
        type: "success",
        text: "Password reset successful! You can now sign in with your new password.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Could not reset password. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  /* ---------- Sign In ---------- */
  const handleLogin = async () => {
    const email = normalizeEmail(formData.email);
    if (!email || !formData.password) {
      setMessage({ type: "error", text: "Please enter both email and password." });
      return;
    }

    setBusy(true);
    clearMessage();

    try {
      const data = await login(email, formData.password, rememberMe);
      setMessage({
        type: "success",
        text: `Welcome back, ${data.user.firstName}!`,
      });
      setFormData((prev) => ({ ...prev, password: "" }));
      if (typeof onAuthSuccess === "function") onAuthSuccess(data.user);

      if (redirectTarget) {
        navigate(redirectTarget, { replace: true });
        return;
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Invalid credentials. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  /* ---------- Register ---------- */
  const handleRegister = async () => {
    const email = normalizeEmail(formData.email);

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setMessage({ type: "error", text: "Please enter your first and last name." });
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
    clearMessage();

    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email,
        location: formData.location.trim(),
        password: formData.password,
      });

      switchView("login", {
        type: "success",
        text: "Account created successfully! Please sign in with your credentials.",
      });
      setFormData((prev) => ({ ...initialForm, email }));
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Could not create account. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  /* ---------- Submit Router ---------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (busy) return;

    if (isLogin) return handleLogin();
    if (isRegister) return handleRegister();
    if (isForgot) {
      if (isForgotEmail) return handleSendOtp(false);
      if (isForgotOtp) return handleVerifyOtp();
      if (isForgotNewPass) return handleSetNewPassword();
      if (isForgotDone) return switchView("login");
    }
  };

  const handleResend = () => {
    if (countdown > 0 || busy) return;
    handleSendOtp(true);
  };

  /* ---------- Save Profile Details ---------- */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileBusy(true);
    setProfileNotice("");

    try {
      await updateProfile(profileForm);
      setProfileNotice("Profile updated successfully!");
      setTimeout(() => setProfileNotice(""), 3500);
    } catch (err) {
      setProfileNotice(err?.message || "Failed to update profile.");
    } finally {
      setProfileBusy(false);
    }
  };

  /* ---------- Address Handlers ---------- */
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      phone: user?.phone || "",
      street: "",
      city: user?.location || "",
      state: "",
      pinCode: "",
      country: "India",
      addressType: "Home",
      isDefault: addresses.length === 0,
    });
    setAddressNotice({ type: "", text: "" });
    setShowAddressForm(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr._id || addr.id);
    setAddressForm({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      pinCode: addr.pinCode || "",
      country: addr.country || "India",
      addressType: addr.addressType || "Home",
      isDefault: Boolean(addr.isDefault),
    });
    setAddressNotice({ type: "", text: "" });
    setShowAddressForm(true);
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setAddressLoading(true);
    setAddressNotice({ type: "", text: "" });

    try {
      let updated;
      if (editingAddressId) {
        updated = await updateAddress(editingAddressId, addressForm);
        setAddressNotice({ type: "success", text: "Address updated successfully!" });
      } else {
        updated = await addAddress(addressForm);
        setAddressNotice({ type: "success", text: "New address added successfully!" });
      }
      if (updated) setAddresses(updated);
      setShowAddressForm(false);
      setEditingAddressId(null);

      if (redirectTarget) {
        setAddressNotice({
          type: "success",
          text: "Address saved! Returning to your artwork checkout...",
        });
        setTimeout(() => {
          navigate(redirectTarget, { replace: true });
        }, 1200);
      } else {
        setTimeout(() => setAddressNotice({ type: "", text: "" }), 3500);
      }
    } catch (err) {
      setAddressNotice({ type: "error", text: err.message || "Failed to save address" });
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to remove this delivery address?")) return;
    try {
      const updated = await deleteAddress(id);
      if (updated) setAddresses(updated);
      setAddressNotice({ type: "success", text: "Address removed successfully." });
      setTimeout(() => setAddressNotice({ type: "", text: "" }), 3500);
    } catch (err) {
      setAddressNotice({ type: "error", text: err.message || "Failed to delete address" });
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      const updated = await setDefaultAddress(id);
      if (updated) setAddresses(updated);
      setAddressNotice({ type: "success", text: "Default delivery address updated." });
      setTimeout(() => setAddressNotice({ type: "", text: "" }), 3500);
    } catch (err) {
      setAddressNotice({ type: "error", text: err.message || "Failed to update default address" });
    }
  };

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id || item._id);
  };

  // VIEW 1: AUTHENTICATED USER DASHBOARD & SUB-PAGES
  // =========================================================================
  const isUserValid = Boolean(
    isAuthenticated && user && (user._id || user.id) && user.email
  );

  // If auth is initializing and no cached user in storage, show a graceful loader
  if (authLoading && !isUserValid) {
    return (
      <div className="MyAccount" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={36} className="MyAccount-spin" style={{ color: "#d08a24" }} />
      </div>
    );
  }

  if (isUserValid) {
    const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
    const joinedDate = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Active Collector";

    const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0] || null;

    const navTabs = [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "profile", label: "My Profile", icon: UserRound },
      { id: "orders", label: "My Orders", icon: Package, badge: orders.length },
      { id: "addresses", label: "Saved Addresses", icon: MapPin, badge: addresses.length },
      { id: "wishlist", label: "My Wishlist", icon: Heart, badge: wishlistCount },
      { id: "cart", label: "Shopping Cart", icon: ShoppingBag, badge: cartCount },
    ];

    return (
      <div className="MyAccount MyAccount-dashboard-wrap">
        <div className="MyAccount-dashboard-container">
          {/* ============ SIDEBAR NAVIGATION ============ */}
          <aside className="MyAccount-sidebar">
            <div className="MyAccount-sidebar-card">
              {/* User Profile Summary */}
              <div className="MyAccount-sidebar-profile">
                <div className="MyAccount-avatar-circle">
                  {user.avatar ? (
                    <img
                      src={formatImageUrl(user.avatar)}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="MyAccount-avatar-img"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                  <button
                    type="button"
                    className="MyAccount-avatar-edit-badge"
                    onClick={() => {
                      setTab("profile");
                      setTimeout(() => avatarInputRef.current?.click(), 120);
                    }}
                    title="Change Profile Photo"
                    aria-label="Change Profile Photo"
                  >
                    <Camera size={13} />
                  </button>
                </div>
                <div className="MyAccount-sidebar-userinfo">
                  <h3 className="MyAccount-sidebar-name">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="MyAccount-sidebar-email">{user.email}</p>
                  <span className="MyAccount-role-badge">
                    {user.role === "admin" ? "Administrator" : "Art Collector"}
                  </span>
                  <span className="MyAccount-sidebar-joined">
                    Member since {joinedDate}
                  </span>
                </div>
              </div>

              <div className="MyAccount-sidebar-divider" />

              {/* Vertical Navigation Menu */}
              <nav className="MyAccount-sidebar-nav" aria-label="Account Navigation">
                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = currentTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      className={`MyAccount-sidebar-btn ${
                        isActive ? "MyAccount-sidebar-btn--active" : ""
                      }`}
                      onClick={() => setTab(tab.id)}
                    >
                      <div className="MyAccount-sidebar-btn-content">
                        <Icon size={18} className="MyAccount-sidebar-btn-icon" />
                        <span className="MyAccount-sidebar-btn-label">
                          {tab.label}
                        </span>
                      </div>
                      {typeof tab.badge === "number" && tab.badge > 0 && (
                        <span className="MyAccount-sidebar-badge">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="MyAccount-sidebar-divider" />

              {/* Sign Out Button in Sidebar */}
              <button
                type="button"
                className="MyAccount-sidebar-logout"
                onClick={handleAccountLogout}
                title="Sign Out"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* ============ MAIN CONTENT AREA ============ */}
          <main className="MyAccount-dashboard-main">
            {/* Tab 1: DASHBOARD OVERVIEW */}
            {currentTab === "dashboard" && (
              <div className="MyAccount-tab-pane">
                <div
                  className="MyAccount-pane-header"
                  style={{ marginBottom: "22px" }}
                >
                  <div>
                    <h3>Welcome back, {user.firstName}!</h3>
                    <p>
                      Here is an overview of your collection, orders, and account
                      settings.
                    </p>
                  </div>
                </div>
              <div className="MyAccount-dashboard-grid">
                <div
                  className="MyAccount-dash-tile"
                  onClick={() => setTab("orders")}
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <div className="MyAccount-dash-tile-head">
                      <span className="MyAccount-tile-title">My Orders</span>
                      <div className="MyAccount-tile-icon">
                        <Package size={20} />
                      </div>
                    </div>
                    <div className="MyAccount-tile-value">
                      {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                    </div>
                  </div>
                  <span className="MyAccount-tile-link">
                    View Orders History &rarr;
                  </span>
                </div>

                <div
                  className="MyAccount-dash-tile"
                  onClick={() => setTab("wishlist")}
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <div className="MyAccount-dash-tile-head">
                      <span className="MyAccount-tile-title">My Wishlist</span>
                      <div className="MyAccount-tile-icon">
                        <Heart size={20} />
                      </div>
                    </div>
                    <div className="MyAccount-tile-value">
                      {wishlistCount} {wishlistCount === 1 ? "Saved Artwork" : "Saved Artworks"}
                    </div>
                  </div>
                  <span className="MyAccount-tile-link">
                    View Wishlist &rarr;
                  </span>
                </div>

                <div
                  className="MyAccount-dash-tile"
                  onClick={() => setTab("cart")}
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <div className="MyAccount-dash-tile-head">
                      <span className="MyAccount-tile-title">Shopping Cart</span>
                      <div className="MyAccount-tile-icon">
                        <ShoppingBag size={20} />
                      </div>
                    </div>
                    <div className="MyAccount-tile-value">
                      {cartCount} {cartCount === 1 ? "Item" : "Items"}
                    </div>
                  </div>
                  <span className="MyAccount-tile-link">
                    Manage Cart &rarr;
                  </span>
                </div>

                <div
                  className="MyAccount-dash-tile"
                  onClick={() => setTab("addresses")}
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <div className="MyAccount-dash-tile-head">
                      <span className="MyAccount-tile-title">Saved Addresses</span>
                      <div className="MyAccount-tile-icon">
                        <MapPin size={20} />
                      </div>
                    </div>
                    <div className="MyAccount-tile-value">
                      {addresses.length} {addresses.length === 1 ? "Address" : "Addresses"}
                    </div>
                  </div>
                  <span className="MyAccount-tile-link">
                    Manage Addresses &rarr;
                  </span>
                </div>
              </div>

              {/* Quick Profile Summary Card */}
              <div className="MyAccount-edit-card" style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Collector Profile</h3>
                    <p style={{ margin: "4px 0 0", color: "#7b6f63", fontSize: "14px" }}>
                      Manage your profile information and delivery settings.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="MyAccount-secondary-btn"
                    onClick={() => setTab("profile")}
                  >
                    <Edit3 size={15} />
                    <span>Edit Profile</span>
                  </button>
                </div>

                <div className="MyAccount-summary-grid">
                  <div className="MyAccount-summary-item">
                    <span className="MyAccount-summary-label">Full Name</span>
                    <strong className="MyAccount-summary-val">{user.firstName} {user.lastName}</strong>
                  </div>
                  <div className="MyAccount-summary-item">
                    <span className="MyAccount-summary-label">Email Address</span>
                    <strong className="MyAccount-summary-val">{user.email}</strong>
                  </div>
                  <div className="MyAccount-summary-item">
                    <span className="MyAccount-summary-label">Phone</span>
                    <strong className="MyAccount-summary-val">{user.phone || "Not set"}</strong>
                  </div>
                  <div className="MyAccount-summary-item">
                    <span className="MyAccount-summary-label">Default Delivery</span>
                    <strong className="MyAccount-summary-val">
                      {defaultAddress
                        ? `${defaultAddress.city}, ${defaultAddress.state}`
                        : "No address saved"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="MyAccount-quick-actions">
                <Link to="/shop" className="MyAccount-primary-btn">
                  <Sparkles size={16} />
                  <span>Explore Art Collection</span>
                </Link>
                <Link to="/gallary" className="MyAccount-secondary-btn">
                  <span>View Heritage Gallery</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          )}

          {/* Tab 2: MY PROFILE */}
          {currentTab === "profile" && (
            <div className="MyAccount-tab-pane">
              <div className="MyAccount-edit-card">
                <div className="MyAccount-pane-header">
                  <div>
                    <h3>Personal Profile Details</h3>
                    <p>Update your personal information and contact details.</p>
                  </div>
                </div>

                {profileNotice && (
                  <div
                    className={`MyAccount-message ${
                      profileNotice.includes("success")
                        ? "MyAccount-message--success"
                        : "MyAccount-message--error"
                    }`}
                    style={{ marginBottom: "22px" }}
                  >
                    {profileNotice.includes("success") ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                    <span>{profileNotice}</span>
                  </div>
                )}

                {/* Profile Photo Upload Section */}
                <div className="MyAccount-avatar-upload-card">
                  <div className="MyAccount-avatar-preview-wrap">
                    {avatarPreview || user.avatar ? (
                      <img
                        src={avatarPreview || formatImageUrl(user.avatar)}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="MyAccount-avatar-preview-img"
                      />
                    ) : (
                      <div className="MyAccount-avatar-preview-fallback">
                        {initials}
                      </div>
                    )}
                    {uploadingAvatar && (
                      <div className="MyAccount-avatar-uploading-overlay">
                        <Loader2 size={24} className="MyAccount-spin" />
                      </div>
                    )}
                  </div>

                  <div className="MyAccount-avatar-upload-info">
                    <h4>Profile Photo</h4>
                    <p>
                      Upload a personalized profile image (JPG, PNG, or WebP up to 15MB). Your photo will appear across your orders, reviews, and header.
                    </p>
                    <div className="MyAccount-avatar-btn-group">
                      <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={handleAvatarFileSelect}
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        style={{ display: "none" }}
                      />
                      <button
                        type="button"
                        className="MyAccount-avatar-upload-btn"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={uploadingAvatar}
                      >
                        <Camera size={16} />
                        <span>
                          {uploadingAvatar
                            ? "Saving Photo..."
                            : user.avatar
                            ? "Change Photo"
                            : "Upload Photo"}
                        </span>
                      </button>

                      {user.avatar && (
                        <button
                          type="button"
                          className="MyAccount-avatar-remove-btn"
                          onClick={handleRemoveAvatar}
                          disabled={uploadingAvatar}
                        >
                          <Trash2 size={15} />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="MyAccount-form">
                  <div className="MyAccount-name-row">
                    <div className="MyAccount-field">
                      <label htmlFor="edit-firstName">First Name</label>
                      <div className="MyAccount-input-wrapper">
                        <UserRound size={18} />
                        <input
                          id="edit-firstName"
                          type="text"
                          name="firstName"
                          value={profileForm.firstName}
                          onChange={handleProfileChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="MyAccount-field">
                      <label htmlFor="edit-lastName">Last Name</label>
                      <div className="MyAccount-input-wrapper">
                        <UserRound size={18} />
                        <input
                          id="edit-lastName"
                          type="text"
                          name="lastName"
                          value={profileForm.lastName}
                          onChange={handleProfileChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="MyAccount-field">
                    <label htmlFor="edit-email">Email Address</label>
                    <div className="MyAccount-input-wrapper">
                      <Mail size={18} />
                      <input
                        id="edit-email"
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="MyAccount-name-row">
                    <div className="MyAccount-field">
                      <label htmlFor="edit-location">City / Location</label>
                      <div className="MyAccount-input-wrapper">
                        <MapPin size={18} />
                        <input
                          id="edit-location"
                          type="text"
                          name="location"
                          placeholder="e.g. Bhubaneswar, Odisha"
                          value={profileForm.location}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>

                    <div className="MyAccount-field">
                      <label htmlFor="edit-phone">Contact Number</label>
                      <div className="MyAccount-input-wrapper">
                        <Phone size={18} />
                        <input
                          id="edit-phone"
                          type="tel"
                          name="phone"
                          placeholder="e.g. +91 98765 43210"
                          value={profileForm.phone}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="MyAccount-field">
                    <label>Account Role &amp; Membership</label>
                    <div className="MyAccount-input-wrapper" style={{ opacity: 0.85, background: "#f8f5f0" }}>
                      <ShieldCheck size={18} />
                      <input
                        type="text"
                        value={`${user.role === "admin" ? "Administrator" : "Art Collector"} · Member since ${joinedDate}`}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "12px", display: "flex", gap: "12px" }}>
                    <button
                      type="submit"
                      className="MyAccount-submit"
                      disabled={profileBusy}
                      style={{ maxWidth: "240px" }}
                    >
                      {profileBusy ? (
                        <>
                          <Loader2 size={18} className="MyAccount-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tab 3: SAVED ADDRESSES */}
          {currentTab === "addresses" && (
            <div className="MyAccount-tab-pane">
              <div className="MyAccount-edit-card">
                <div className="MyAccount-pane-header">
                  <div>
                    <h3>Saved Delivery Addresses</h3>
                    <p>Manage your delivery and billing addresses for artwork shipments.</p>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    {redirectTarget && (
                      <Link
                        to={redirectTarget}
                        className="MyAccount-secondary-btn"
                        style={{ padding: "8px 14px", fontSize: "13px" }}
                      >
                        ← Return to Checkout
                      </Link>
                    )}
                    {!showAddressForm && (
                      <button
                        type="button"
                        className="MyAccount-primary-btn"
                        onClick={handleOpenAddAddress}
                      >
                        <Plus size={16} />
                        <span>Add New Address</span>
                      </button>
                    )}
                  </div>
                </div>

                {addressNotice.text && (
                  <div
                    className={`MyAccount-message ${
                      addressNotice.type === "success"
                        ? "MyAccount-message--success"
                        : "MyAccount-message--error"
                    }`}
                    style={{ marginBottom: "22px" }}
                  >
                    {addressNotice.type === "success" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                    <span>{addressNotice.text}</span>
                  </div>
                )}

                {/* Add / Edit Address Form Modal / Inline */}
                {showAddressForm && (
                  <div className="MyAccount-address-form-box">
                    <div className="MyAccount-address-form-head">
                      <h4>{editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}</h4>
                      <button
                        type="button"
                        className="MyAccount-icon-close"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddressId(null);
                        }}
                        aria-label="Close form"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveAddress} className="MyAccount-form">
                      <div className="MyAccount-name-row">
                        <div className="MyAccount-field">
                          <label>Full Name *</label>
                          <div className="MyAccount-input-wrapper">
                            <UserRound size={18} />
                            <input
                              type="text"
                              name="fullName"
                              value={addressForm.fullName}
                              onChange={handleAddressChange}
                              required
                              placeholder="Receiver full name"
                            />
                          </div>
                        </div>

                        <div className="MyAccount-field">
                          <label>Contact Phone Number *</label>
                          <div className="MyAccount-input-wrapper">
                            <Phone size={18} />
                            <input
                              type="tel"
                              name="phone"
                              value={addressForm.phone}
                              onChange={handleAddressChange}
                              required
                              placeholder="10-digit mobile number"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="MyAccount-field">
                        <label>Street Address, Flat, Building, Landmark *</label>
                        <div className="MyAccount-input-wrapper">
                          <Building size={18} />
                          <input
                            type="text"
                            name="street"
                            value={addressForm.street}
                            onChange={handleAddressChange}
                            required
                            placeholder="Flat / House No., Apartment, Street, Area"
                          />
                        </div>
                      </div>

                      <div className="MyAccount-name-row">
                        <div className="MyAccount-field">
                          <label>City / Town *</label>
                          <div className="MyAccount-input-wrapper">
                            <MapPin size={18} />
                            <input
                              type="text"
                              name="city"
                              value={addressForm.city}
                              onChange={handleAddressChange}
                              required
                              placeholder="City"
                            />
                          </div>
                        </div>

                        <div className="MyAccount-field">
                          <label>State *</label>
                          <div className="MyAccount-input-wrapper">
                            <input
                              type="text"
                              name="state"
                              value={addressForm.state}
                              onChange={handleAddressChange}
                              required
                              placeholder="State / Province"
                              style={{ paddingLeft: "14px" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="MyAccount-name-row">
                        <div className="MyAccount-field">
                          <label>PIN Code *</label>
                          <div className="MyAccount-input-wrapper">
                            <input
                              type="text"
                              name="pinCode"
                              value={addressForm.pinCode}
                              onChange={handleAddressChange}
                              required
                              placeholder="e.g. 751001"
                              style={{ paddingLeft: "14px" }}
                            />
                          </div>
                        </div>

                        <div className="MyAccount-field">
                          <label>Address Type</label>
                          <select
                            name="addressType"
                            value={addressForm.addressType}
                            onChange={handleAddressChange}
                            className="MyAccount-select"
                          >
                            <option value="Home">Home (7 AM - 9 PM)</option>
                            <option value="Office">Office (10 AM - 6 PM)</option>
                            <option value="Studio">Studio / Gallery</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="MyAccount-checkbox-row">
                        <label className="MyAccount-checkbox-label">
                          <input
                            type="checkbox"
                            name="isDefault"
                            checked={addressForm.isDefault}
                            onChange={handleAddressChange}
                          />
                          <span>Set as default shipping address</span>
                        </label>
                      </div>

                      <div className="MyAccount-form-actions">
                        <button
                          type="submit"
                          className="MyAccount-submit"
                          disabled={addressLoading}
                          style={{ maxWidth: "200px" }}
                        >
                          {addressLoading ? (
                            <>
                              <Loader2 size={16} className="MyAccount-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              <span>Save Address</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          className="MyAccount-secondary-btn"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditingAddressId(null);
                          }}
                        >
                          <span>Cancel</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Addresses List */}
                {addresses.length === 0 ? (
                  <div className="MyAccount-empty-box">
                    <div className="MyAccount-empty-icon">
                      <MapPin size={38} />
                    </div>
                    <h4>No Addresses Saved Yet</h4>
                    <p>Add your shipping address for a swift and seamless checkout experience.</p>
                    <button
                      type="button"
                      className="MyAccount-primary-btn"
                      onClick={handleOpenAddAddress}
                      style={{ marginTop: "14px" }}
                    >
                      <Plus size={16} />
                      <span>Add Your First Address</span>
                    </button>
                  </div>
                ) : (
                  <div className="MyAccount-address-grid">
                    {addresses.map((addr) => {
                      const addrId = addr._id || addr.id;
                      return (
                        <div
                          key={addrId}
                          className={`MyAccount-address-card ${
                            addr.isDefault ? "MyAccount-address-card--default" : ""
                          }`}
                        >
                          <div className="MyAccount-address-badges">
                            <span className="MyAccount-type-badge">
                              {addr.addressType === "Home" && <Home size={13} />}
                              {addr.addressType === "Office" && <Briefcase size={13} />}
                              {addr.addressType === "Studio" && <Sparkles size={13} />}
                              <span>{addr.addressType || "Home"}</span>
                            </span>
                            {addr.isDefault && (
                              <span className="MyAccount-default-badge">
                                <Check size={12} />
                                <span>Default</span>
                              </span>
                            )}
                          </div>

                          <h4 className="MyAccount-addr-name">{addr.fullName}</h4>
                          <p className="MyAccount-addr-phone">Phone: {addr.phone}</p>
                          <p className="MyAccount-addr-street">
                            {addr.street}, {addr.city}, {addr.state} - {addr.pinCode}
                          </p>
                          <p className="MyAccount-addr-country">{addr.country || "India"}</p>

                          <div className="MyAccount-addr-actions">
                            {!addr.isDefault && (
                              <button
                                type="button"
                                className="MyAccount-addr-action-btn"
                                onClick={() => handleSetDefaultAddress(addrId)}
                                title="Set as default address"
                              >
                                Set as Default
                              </button>
                            )}
                            <button
                              type="button"
                              className="MyAccount-addr-action-btn"
                              onClick={() => handleOpenEditAddress(addr)}
                            >
                              <Edit3 size={14} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="MyAccount-addr-action-btn MyAccount-addr-action-btn--delete"
                              onClick={() => handleDeleteAddress(addrId)}
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: MY ORDERS */}
          {currentTab === "orders" && (
            <div className="MyAccount-tab-pane">
              <div className="MyAccount-edit-card">
                <div className="MyAccount-pane-header">
                  <div>
                    <h3>Order History &amp; Tracking</h3>
                    <p>Track the status of your artwork purchases and delivery progress.</p>
                  </div>
                </div>

                {ordersLoading ? (
                  <div className="MyAccount-empty-box">
                    <Loader2 className="MyAccount-spinner" size={36} />
                    <h4 style={{ marginTop: "16px" }}>Loading Your Orders...</h4>
                    <p>Fetching your collection purchase history.</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="MyAccount-empty-box">
                    <div className="MyAccount-empty-icon">
                      <Package size={38} />
                    </div>
                    <h4>No Orders Placed Yet</h4>
                    <p>
                      You haven't purchased any artworks yet. Explore our handcrafted
                      sculptures, heritage paintings, and tribal art collections.
                    </p>
                    <Link
                      to="/shop"
                      className="MyAccount-primary-btn"
                      style={{ marginTop: "16px" }}
                    >
                      <Sparkles size={16} />
                      <span>Explore Art Collection</span>
                    </Link>
                  </div>
                ) : (
                  <div className="MyAccount-orders-list">
                    {orders.map((ord, idx) => (
                      <div key={ord.id || ord._id || idx} className="MyAccount-order-card">
                        <div className="MyAccount-order-head">
                          <div className="MyAccount-order-head-info">
                            <span className="MyAccount-order-id">
                              Order #{ord.orderNumber || ord.id || `AC-${idx + 1001}`}
                            </span>
                            <span className="MyAccount-order-date">
                              Placed on {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ord.date ? new Date(ord.date).toLocaleDateString("en-IN") : "Recent"}
                            </span>
                          </div>
                          {(() => {
                            const isPaid =
                              (ord.payment?.status === "captured" || ord.payment?.status === "success") &&
                              Boolean(ord.payment?.razorpayPaymentId && ord.payment?.razorpayPaymentId !== "-");
                            const isFailed =
                              ord.status === "Payment Failed" ||
                              ord.status === "Cancelled" ||
                              ord.payment?.status === "failed" ||
                              (!isPaid && ord.payment?.status === "created");

                            return (
                              <div className="MyAccount-order-badges">
                                {isPaid ? (
                                  <span className="MyAccount-order-status MyAccount-order-status--paid">
                                    Paid
                                  </span>
                                ) : isFailed ? (
                                  <span className="MyAccount-order-status MyAccount-order-status--cancelled">
                                    Payment Failed
                                  </span>
                                ) : null}
                                <span
                                  className={`MyAccount-order-status MyAccount-order-status--${(ord.status || (isFailed ? "cancelled" : "processing")).toLowerCase().replace(/\s+/g, "-")}`}
                                >
                                  {ord.status || (isFailed ? "Payment Failed" : "Processing")}
                                </span>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Compact Items Row: Show 1st item + badge if more items, clicking opens details page */}
                        <div
                          className="MyAccount-order-items MyAccount-order-items--compact"
                          onClick={() => {
                            const targetId = ord.orderNumber || ord.id || ord._id;
                            navigate(`/order-details/${encodeURIComponent(targetId)}`, { state: { order: ord } });
                          }}
                          title="Click to view full order details page"
                          style={{ cursor: "pointer" }}
                        >
                          {ord.items && ord.items.length > 0 ? (
                            <div className="MyAccount-order-item-row">
                              <div className="MyAccount-order-thumb-wrap">
                                <img
                                  src={formatImageUrl(ord.items[0].image) || heroImage}
                                  alt={ord.items[0].title || "Artwork"}
                                  className="MyAccount-order-thumb"
                                />
                                {ord.items.length > 1 && (
                                  <span className="MyAccount-order-thumb-count" title={`${ord.items.length - 1} more item(s)`}>
                                    +{ord.items.length - 1}
                                  </span>
                                )}
                              </div>
                              <div className="MyAccount-order-item-details">
                                <div className="MyAccount-order-item-title-group">
                                  <h5 title={ord.items[0].title || "Artwork"}>{ord.items[0].title || "Original Artwork"}</h5>
                                  {ord.items.length > 1 && (
                                    <span className="MyAccount-order-more-tag">
                                      +{ord.items.length - 1} more {ord.items.length - 1 === 1 ? "item" : "items"}
                                    </span>
                                  )}
                                </div>
                                <p className="MyAccount-order-item-price">Qty: {ord.items[0].quantity || 1} · ₹{(ord.items[0].price || 0).toLocaleString("en-IN")}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="MyAccount-order-item-row">
                              <p style={{ margin: 0, color: "#7b6f63", fontSize: "12.5px" }}>Original Artworks Order</p>
                            </div>
                          )}
                        </div>

                        <div className="MyAccount-order-footer">
                          <div className="MyAccount-order-total-info">
                            <span className="MyAccount-order-total-label">
                              Total: <strong>₹{(ord.totalAmount || ord.total || 0).toLocaleString("en-IN")}</strong>
                            </span>
                            <span className="MyAccount-order-shipping-note">(Free Shipping &amp; Taxes Included)</span>
                          </div>
                          <div className="MyAccount-order-actions">
                            {(ord.status || "").trim().toLowerCase() === "delivered" && (
                              <button
                                type="button"
                                onClick={(e) => handleDownloadOrderInvoice(e, ord)}
                                disabled={downloadingOrderId === (ord.orderNumber || ord.id || ord._id)}
                                className="MyAccount-download-invoice-btn"
                                title="Download official Tax Invoice PDF"
                              >
                                {downloadingOrderId === (ord.orderNumber || ord.id || ord._id) ? (
                                  <>
                                    <Loader2 size={13} className="MyAccount-spin" />
                                    <span>Downloading...</span>
                                  </>
                                ) : (
                                  <>
                                    <Download size={13} />
                                    <span>Invoice</span>
                                  </>
                                )}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const targetId = ord.orderNumber || ord.id || ord._id;
                                navigate(`/order-details/${encodeURIComponent(targetId)}`, { state: { order: ord } });
                              }}
                              className="MyAccount-view-order-btn"
                              title="Click to view complete order details page"
                            >
                              <span>View Details</span>
                              <ArrowRight size={13} />
                            </button>
                            <a
                              href={getWhatsAppUrl(
                                WHATSAPP_NUMBER,
                                `Hello Art & Culture! I need help with my Order #${ord.orderNumber || ord.id || ord._id}.`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="MyAccount-secondary-btn MyAccount-help-btn"
                              style={{ textDecoration: "none" }}
                              title="Chat with support on WhatsApp"
                            >
                              Need Help?
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 5: MY WISHLIST */}
          {currentTab === "wishlist" && (
            <div className="MyAccount-tab-pane">
              <div className="MyAccount-edit-card">
                <div className="MyAccount-pane-header">
                  <div>
                    <h3>Saved Artworks ({wishlistCount})</h3>
                    <p>Curated artworks you've favorited for your personal collection.</p>
                  </div>
                  {wishlistCount > 0 && (
                    <Link to="/wishlist" className="MyAccount-secondary-btn">
                      <span>View Full Wishlist</span>
                      <ExternalLink size={14} />
                    </Link>
                  )}
                </div>

                {wishlist.length === 0 ? (
                  <div className="MyAccount-empty-box">
                    <div className="MyAccount-empty-icon">
                      <Heart size={38} />
                    </div>
                    <h4>Your Wishlist is Empty</h4>
                    <p>
                      Discover original handcrafted pieces and save your favorite art to purchase later.
                    </p>
                    <Link
                      to="/shop"
                      className="MyAccount-primary-btn"
                      style={{ marginTop: "16px" }}
                    >
                      <Sparkles size={16} />
                      <span>Browse Artworks</span>
                    </Link>
                  </div>
                ) : (
                  <div className="MyAccount-wish-grid">
                    {wishlist.map((item) => {
                      const itemId = item.id || item._id;
                      const itemSlug = item.slug || (item.title ? encodeURIComponent(item.title.toLowerCase().replace(/\s+/g, "-")) : itemId);
                      const priceFormatted = typeof item.price === "number" ? `₹${item.price.toLocaleString("en-IN")}` : `₹${item.price || 0}`;

                      return (
                        <div key={itemId} className="MyAccount-wish-card">
                          <div className="MyAccount-wish-img-wrap">
                            <img
                              src={item.image || item.images?.[0] || heroImage}
                              alt={item.title}
                              className="MyAccount-wish-img"
                            />
                            <button
                              type="button"
                              className="MyAccount-wish-remove"
                              onClick={() => removeFromWishlist(itemId)}
                              title="Remove from wishlist"
                              aria-label="Remove from wishlist"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          <div className="MyAccount-wish-body">
                            <span className="MyAccount-wish-category">
                              {item.category || item.artType || "Original Art"}
                            </span>
                            <h4 className="MyAccount-wish-title">
                              <Link to={`/shop/${itemSlug}`}>{item.title}</Link>
                            </h4>
                            <p className="MyAccount-wish-price">{priceFormatted}</p>

                            <button
                              type="button"
                              className="MyAccount-wish-cart-btn"
                              onClick={() => handleMoveToCart(item)}
                            >
                              <ShoppingBag size={15} />
                              <span>Move to Cart</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 6: SHOPPING CART */}
          {currentTab === "cart" && (
            <div className="MyAccount-tab-pane">
              <div className="MyAccount-edit-card">
                <div className="MyAccount-pane-header">
                  <div>
                    <h3>Shopping Cart Preview ({cartCount} {cartCount === 1 ? "Item" : "Items"})</h3>
                    <p>Review items in your cart and proceed to checkout.</p>
                  </div>
                  {cartCount > 0 && (
                    <Link to="/cart" className="MyAccount-primary-btn">
                      <span>Go to Full Cart Page</span>
                      <ArrowRight size={15} />
                    </Link>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="MyAccount-empty-box">
                    <div className="MyAccount-empty-icon">
                      <ShoppingBag size={38} />
                    </div>
                    <h4>Your Cart is Currently Empty</h4>
                    <p>
                      Explore masterpieces from master artisans and add them to your cart.
                    </p>
                    <Link
                      to="/shop"
                      className="MyAccount-primary-btn"
                      style={{ marginTop: "16px" }}
                    >
                      <Sparkles size={16} />
                      <span>Browse Art Shop</span>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div className="MyAccount-cart-list">
                      {cart.map((item) => {
                        const itemId = item.id || item._id;
                        const itemSlug = item.slug || (item.title ? encodeURIComponent(item.title.toLowerCase().replace(/\s+/g, "-")) : itemId);
                        const unitPrice = Number(item.price) || 0;
                        const itemQty = Number(item.quantity) || 1;
                        const itemTotal = unitPrice * itemQty;

                        return (
                          <div key={itemId} className="MyAccount-cart-item-row">
                            <img
                              src={item.image || item.images?.[0] || heroImage}
                              alt={item.title}
                              className="MyAccount-cart-thumb"
                            />
                            <div className="MyAccount-cart-item-info">
                              <h4>
                                <Link to={`/shop/${itemSlug}`}>{item.title}</Link>
                              </h4>
                              <p className="MyAccount-cart-unit-price">
                                ₹{unitPrice.toLocaleString("en-IN")} each
                              </p>
                            </div>

                            <div className="MyAccount-cart-qty-ctrl">
                              <button
                                type="button"
                                onClick={() => updateQuantity(itemId, itemQty - 1)}
                                disabled={itemQty <= 1}
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span>{itemQty}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(itemId, itemQty + 1)}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            <div className="MyAccount-cart-item-total">
                              <strong>₹{itemTotal.toLocaleString("en-IN")}</strong>
                            </div>

                            <button
                              type="button"
                              className="MyAccount-cart-remove"
                              onClick={() => removeFromCart(itemId)}
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="MyAccount-cart-summary-bar">
                      <div className="MyAccount-cart-subtotal-text">
                        <span>Cart Subtotal: </span>
                        <strong>₹{Number(subtotal).toLocaleString("en-IN")}</strong>
                      </div>
                      <Link to="/cart" className="MyAccount-primary-btn">
                        <span>Proceed to Secure Checkout</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* ORDER DETAILS MODAL (Pop-up on order click) */}
          {/* ============================================================= */}
          {selectedOrderModal && (
            <div
              className="MyAccount-modal-backdrop"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedOrderModal(null);
              }}
            >
              <div className="MyAccount-modal MyAccount-order-modal">
                {/* Modal Header */}
                <div className="MyAccount-order-modal-header">
                  <div className="MyAccount-order-modal-title-group">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                      <span className="MyAccount-modal-eyebrow">ORDER DETAILS</span>
                      {(() => {
                        const isModalPaid =
                          (selectedOrderModal.payment?.status === "captured" || selectedOrderModal.payment?.status === "success") &&
                          Boolean(selectedOrderModal.payment?.razorpayPaymentId && selectedOrderModal.payment?.razorpayPaymentId !== "-");
                        const isModalFailed =
                          selectedOrderModal.status === "Payment Failed" ||
                          selectedOrderModal.status === "Cancelled" ||
                          selectedOrderModal.payment?.status === "failed" ||
                          (!isModalPaid && selectedOrderModal.payment?.status === "created");

                        return (
                          <>
                            {isModalPaid ? (
                              <span
                                className="MyAccount-order-status"
                                style={{ background: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9" }}
                              >
                                Paid
                              </span>
                            ) : isModalFailed ? (
                              <span
                                className="MyAccount-order-status MyAccount-order-status--cancelled"
                              >
                                Payment Failed
                              </span>
                            ) : null}
                            <span
                              className={`MyAccount-order-status MyAccount-order-status--${(selectedOrderModal.status || (isModalFailed ? "cancelled" : "processing")).toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              {selectedOrderModal.status || (isModalFailed ? "Payment Failed" : "Processing")}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                    <h2>Order #{selectedOrderModal.orderNumber || selectedOrderModal.id || selectedOrderModal._id}</h2>
                    <p className="MyAccount-order-modal-date">
                      <Calendar size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                      Placed on {selectedOrderModal.createdAt ? new Date(selectedOrderModal.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="MyAccount-modal-close-btn"
                    onClick={() => setSelectedOrderModal(null)}
                    aria-label="Close order details"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="MyAccount-order-modal-content">
                  {/* 2-col info cards: Delivery details & Payment info */}
                  <div className="MyAccount-order-modal-grid">
                    <div className="MyAccount-order-info-card">
                      <div className="MyAccount-order-info-card-header">
                        <MapPin size={16} />
                        <h4>Delivery Address</h4>
                      </div>
                      <div className="MyAccount-order-info-card-body">
                        <strong>{selectedOrderModal.customer?.fullName || user?.name || "Art Collector"}</strong>
                        <p style={{ margin: "5px 0", color: "#4b3d30", fontSize: "13px", lineHeight: "1.5" }}>
                          {selectedOrderModal.customer?.address || "Delivery address confirmed at checkout"}
                        </p>
                        <div style={{ marginTop: "8px", fontSize: "12.5px", color: "#7b6f63", display: "flex", flexDirection: "column", gap: "2px" }}>
                          {selectedOrderModal.customer?.phone && (
                            <div>Phone: <strong style={{ color: "#3e2723" }}>{selectedOrderModal.customer.phone}</strong></div>
                          )}
                          {selectedOrderModal.customer?.email && (
                            <div>Email: <span style={{ color: "#3e2723" }}>{selectedOrderModal.customer.email}</span></div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="MyAccount-order-info-card">
                      <div className="MyAccount-order-info-card-header">
                        <ShieldCheck size={16} />
                        <h4>Payment Information</h4>
                      </div>
                      <div className="MyAccount-order-info-card-body">
                        <div className="MyAccount-order-info-row">
                          <span>Gateway:</span>
                          <strong>Prepaid Online</strong>
                        </div>
                        <div className="MyAccount-order-info-row">
                          <span>Payment Status:</span>
                          <strong
                            style={{
                              color:
                                selectedOrderModal.payment?.status === "captured"
                                  ? "#2e7d32"
                                  : selectedOrderModal.payment?.status === "failed" || selectedOrderModal.status === "Payment Failed"
                                  ? "#dc2626"
                                  : "#b06f15",
                              textTransform: "capitalize",
                            }}
                          >
                            {selectedOrderModal.payment?.status === "failed" || selectedOrderModal.status === "Payment Failed"
                              ? "Failed / Unpaid"
                              : selectedOrderModal.payment?.status || "Pending"}
                          </strong>
                        </div>
                        {selectedOrderModal.payment?.razorpayPaymentId && (
                          <div className="MyAccount-order-info-row">
                            <span>Payment ID:</span>
                            <code style={{ fontSize: "11px", background: "#f8f5ee", padding: "2px 6px", borderRadius: "4px", wordBreak: "break-all" }}>
                              {selectedOrderModal.payment.razorpayPaymentId}
                            </code>
                          </div>
                        )}
                        {selectedOrderModal.payment?.razorpayOrderId && (
                          <div className="MyAccount-order-info-row">
                            <span>Order ID:</span>
                            <code style={{ fontSize: "11px", background: "#f8f5ee", padding: "2px 6px", borderRadius: "4px", wordBreak: "break-all" }}>
                              {selectedOrderModal.payment.razorpayOrderId}
                            </code>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="MyAccount-order-modal-items-section">
                    <h4>
                      Purchased Artworks ({selectedOrderModal.items?.length || 0})
                    </h4>
                    <div className="MyAccount-order-modal-items-list">
                      {(selectedOrderModal.items || []).map((item, idx) => (
                        <div key={idx} className="MyAccount-order-modal-item">
                          <img
                            src={formatImageUrl(item.image) || heroImage}
                            alt={item.title}
                            className="MyAccount-order-modal-item-img"
                          />
                          <div className="MyAccount-order-modal-item-info">
                            <h5>{item.title}</h5>
                            <span className="MyAccount-order-modal-item-qty">
                              Qty: {item.quantity || 1} · ₹{(item.price || 0).toLocaleString("en-IN")} each
                            </span>
                          </div>
                          <div className="MyAccount-order-modal-item-total">
                            ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial summary breakdown */}
                  <div className="MyAccount-order-summary-box">
                    <div className="MyAccount-order-summary-row">
                      <span>Artwork Subtotal</span>
                      <strong>₹{(selectedOrderModal.subtotal || selectedOrderModal.totalAmount || 0).toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="MyAccount-order-summary-row">
                      <span>Standard Insured Shipping</span>
                      <span style={{ color: "#2e7d32", fontWeight: "600" }}>FREE</span>
                    </div>
                    <div className="MyAccount-order-summary-row">
                      <span>GST &amp; Taxes</span>
                      <span>Included</span>
                    </div>
                    <div className="MyAccount-order-summary-row MyAccount-order-summary-row--total">
                      <span>Total Amount Paid</span>
                      <strong>₹{(selectedOrderModal.totalAmount || selectedOrderModal.total || 0).toLocaleString("en-IN")}</strong>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="MyAccount-order-modal-footer">
                  <a
                    href={getWhatsAppUrl(
                      WHATSAPP_NUMBER,
                      `Hello Art & Culture! I need help with my Order #${selectedOrderModal?.orderNumber || selectedOrderModal?.id || selectedOrderModal?._id}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="MyAccount-secondary-btn"
                    style={{ padding: "8px 18px", fontSize: "13px", textDecoration: "none" }}
                    title="Chat with support on WhatsApp"
                  >
                    Need Help with this Order?
                  </a>
                  <button
                    type="button"
                    className="MyAccount-primary-btn"
                    style={{ padding: "8px 24px", fontSize: "13px" }}
                    onClick={() => setSelectedOrderModal(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          </main>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATION FORMS (LOGIN / REGISTER / FORGOT)
  // =========================================================================
  const headingTitle = isForgot
    ? isForgotOtp
      ? "Verify 6-Digit OTP"
      : isForgotNewPass
      ? "Set New Password"
      : isDone
      ? "Password Updated"
      : "Forgot Password?"
    : isRegister
    ? "Create Account"
    : "Sign In";

  const headingText = isForgot
    ? isForgotOtp
      ? `Enter the 6-digit verification code sent to ${normalizeEmail(formData.email)}.`
      : isForgotNewPass
      ? "Code verified! Please create your new secure password."
      : isDone
      ? "Your password has been changed successfully."
      : "Enter your registered email address to receive a 6-digit verification code."
    : content.formText;

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
                        {isForgotOtp ? (
                          <ShieldCheck size={26} />
                        ) : isForgotNewPass ? (
                          <KeyRound size={26} />
                        ) : (
                          <Mail size={26} />
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

                    {isRegister && (
                      <div className="MyAccount-field">
                        <label htmlFor="MyAccount-location">
                          Location (City, State)
                        </label>
                        <div className="MyAccount-input-wrapper">
                          <MapPin size={18} />
                          <input
                            id="MyAccount-location"
                            type="text"
                            name="location"
                            placeholder="e.g. Bhubaneswar, Odisha"
                            value={formData.location}
                            onChange={handleChange}
                            disabled={busy}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 2: 6-Digit OTP */}
                    {isForgotOtp && (
                      <div className="MyAccount-field">
                        <div className="MyAccount-field-header">
                          <label htmlFor="MyAccount-otp-0">
                            6-Digit Verification Code
                          </label>
                          <button
                            type="button"
                            className="MyAccount-forgot-link"
                            onClick={() => {
                              setResetStep("email");
                              clearMessage();
                            }}
                          >
                            Change email
                          </button>
                        </div>
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
                              disabled={busy}
                              required
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {showPasswordField && (
                      <div className="MyAccount-field">
                        <div className="MyAccount-field-header">
                          <label htmlFor="MyAccount-password">
                            {isForgotNewPass ? "New Password" : "Password"}
                          </label>
                          {isLogin && (
                            <button
                              type="button"
                              className="MyAccount-forgot-link"
                              onClick={() => switchView("forgot")}
                            >
                              Forgot password?
                            </button>
                          )}
                        </div>

                        <div className="MyAccount-input-wrapper">
                          <LockKeyhole size={18} />
                          <input
                            id="MyAccount-password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder={
                              isForgotNewPass
                                ? "Enter your new password"
                                : "Enter your password"
                            }
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete={
                              isLogin ? "current-password" : "new-password"
                            }
                            disabled={busy}
                            required
                          />
                          <button
                            type="button"
                            className="MyAccount-eye-btn"
                            onClick={() => setShowPassword((p) => !p)}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {showConfirmField && (
                      <div className="MyAccount-field">
                        <label htmlFor="MyAccount-confirmPassword">
                          Confirm {isForgotNewPass ? "New " : ""}Password
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
                            disabled={busy}
                            required
                          />
                          <button
                            type="button"
                            className="MyAccount-eye-btn"
                            onClick={() => setShowConfirmPassword((p) => !p)}
                            aria-label={
                              showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                            }
                            tabIndex={-1}
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
                            {passwordsMatch
                              ? "Passwords match"
                              : "Passwords do not match"}
                          </p>
                        )}
                      </div>
                    )}

                    {isLogin && (
                      <div className="MyAccount-options">
                        <label className="MyAccount-checkbox">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                          />
                          <span>Remember me</span>
                        </label>
                      </div>
                    )}

                    {message.text && (
                      <div
                        className={`MyAccount-message MyAccount-message--${message.type}`}
                        role="alert"
                      >
                        {message.type === "success" ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <AlertCircle size={18} />
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
                            {isForgotEmail && "Checking email..."}
                            {isForgotOtp && "Verifying OTP..."}
                            {isForgotNewPass && "Resetting password..."}
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
                          <span>Register Account</span>
                        </>
                      ) : isForgotEmail ? (
                        <>
                          <Send size={18} />
                          <span>Send 6-Digit OTP</span>
                        </>
                      ) : isForgotOtp ? (
                        <>
                          <ShieldCheck size={18} />
                          <span>Verify OTP</span>
                        </>
                      ) : isForgotNewPass ? (
                        <>
                          <KeyRound size={18} />
                          <span>Reset Password</span>
                        </>
                      ) : (
                        <>
                          <LogIn size={18} />
                          <span>Sign In</span>
                        </>
                      )}
                    </button>

                    {(isLogin || isRegister) && (
                      <div className="MyAccount-oauth-section">
                        <div className="MyAccount-divider">
                          <span>or</span>
                        </div>

                        <button
                          type="button"
                          className="MyAccount-google-btn"
                          onClick={handleGoogleSignIn}
                          disabled={googleBusy || busy}
                          title="Sign in or register instantly with Google"
                        >
                          {googleBusy ? (
                            <>
                              <Loader2 size={18} className="MyAccount-spin" />
                              <span>Connecting to Google...</span>
                            </>
                          ) : (
                            <>
                              <svg className="MyAccount-google-icon" viewBox="0 0 24 24" width="19" height="19">
                                <path
                                  fill="#4285F4"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                  fill="#34A853"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                  fill="#FBBC05"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                  fill="#EA4335"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                              </svg>
                              <span>Continue with Google</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {isForgotOtp && (
                      <div className="MyAccount-reset-links">
                        <button
                          type="button"
                          className="MyAccount-link-button"
                          onClick={handleResend}
                          disabled={countdown > 0 || busy}
                        >
                          {countdown > 0
                            ? `Resend OTP in ${countdown}s`
                            : "Resend 6-Digit OTP"}
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
