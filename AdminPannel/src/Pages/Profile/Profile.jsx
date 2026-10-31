import React, { useState, useEffect } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
  Clock,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
} from "lucide-react";
import { ADMIN_AUTH_API_URL } from "../../config/api";
import { getAdminToken, setAdminSession, getAdminUser } from "../../utils/adminAuth";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "Culture Administrator",
    email: "art@culture.com",
    username: "art",
    phone: "",
    role: "Culture Administrator",
    avatar: "",
    status: "Active",
    lastLogin: null,
    createdAt: null,
  });

  const [activeTab, setActiveTab] = useState("general"); // "general" or "security"
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

  // Password change state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  // Fetch admin profile
  const fetchProfile = async () => {
    try {
      const token = getAdminToken();
      if (!token) return;

      const res = await fetch(`${ADMIN_AUTH_API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.admin) {
          setProfile((prev) => ({
            ...prev,
            ...data.admin,
          }));
          setAdminSession(token, data.admin);
        }
      }
    } catch (err) {
      console.error("Failed to load admin profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = getAdminUser();
    if (cached) {
      setProfile((prev) => ({ ...prev, ...cached }));
    }
    fetchProfile();
  }, []);

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: "", text: "" });
    setSavingProfile(true);

    try {
      const token = getAdminToken();
      const res = await fetch(`${ADMIN_AUTH_API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          username: profile.username,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProfileMessage({ type: "success", text: "Profile details updated successfully!" });
        setAdminSession(token, data.admin);
      } else {
        setProfileMessage({ type: "error", text: data.message || "Failed to update profile." });
      }
    } catch (err) {
      setProfileMessage({ type: "error", text: "Server communication error." });
    } finally {
      setSavingProfile(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    if (!passwords.currentPassword || !passwords.newPassword) {
      setPasswordMessage({ type: "error", text: "Please fill in all password fields." });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    setSavingPassword(true);

    try {
      const token = getAdminToken();
      const res = await fetch(`${ADMIN_AUTH_API_URL}/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordMessage({ type: "success", text: "Administrator password updated successfully!" });
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordMessage({ type: "error", text: data.message || "Failed to change password." });
      }
    } catch (err) {
      setPasswordMessage({ type: "error", text: "Server communication error." });
    } finally {
      setSavingPassword(false);
    }
  };

  const initial = (profile.name || "A").trim().charAt(0).toUpperCase();

  const formatDate = (dateString) => {
    if (!dateString) return "Active Session";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="AdminProfile-page">
      {/* Top Banner Card */}
      <div className="AdminProfile-banner-card">
        <div className="AdminProfile-banner-glow" />
        <div className="AdminProfile-header-flex">
          <div className="AdminProfile-avatar-wrap">
            <span className="AdminProfile-avatar-circle">{initial}</span>
            <span className="AdminProfile-status-dot" title="Active Administrator" />
          </div>

          <div className="AdminProfile-intro">
            <div className="AdminProfile-title-row">
              <h1 className="AdminProfile-name">{profile.name}</h1>
              <span className="AdminProfile-role-badge">
                <Shield size={12} />
                {profile.role || "Culture Administrator"}
              </span>
            </div>
            <p className="AdminProfile-email">{profile.email}</p>

            <div className="AdminProfile-meta-pills">
              <span className="AdminProfile-meta-pill">
                <UserCheck size={13} style={{ color: "#16a34a" }} />
                <span>Account Status: {profile.status || "Active"}</span>
              </span>
              <span className="AdminProfile-meta-pill">
                <Clock size={13} style={{ color: "#8c5b0c" }} />
                <span>Last Login: {formatDate(profile.lastLogin)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="AdminProfile-tabs">
        <button
          type="button"
          className={`AdminProfile-tab-btn ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          <UserRound size={16} />
          <span>General Information</span>
        </button>

        <button
          type="button"
          className={`AdminProfile-tab-btn ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <KeyRound size={16} />
          <span>Security &amp; Password</span>
        </button>
      </div>

      {/* Tab 1: General Info */}
      {activeTab === "general" && (
        <div className="AdminProfile-content-card">
          <div className="AdminProfile-card-header">
            <div>
              <h3 className="AdminProfile-section-title">Administrator Profile Details</h3>
              <p className="AdminProfile-section-subtitle">
                Manage your administrative identity and contact information.
              </p>
            </div>
          </div>

          {profileMessage.text && (
            <div className={`AdminProfile-alert AdminProfile-alert--${profileMessage.type}`}>
              {profileMessage.type === "success" ? (
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              ) : (
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
              )}
              <span>{profileMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="AdminProfile-form">
            <div className="AdminProfile-grid">
              <div className="AdminProfile-field">
                <label className="AdminProfile-label">Full Name</label>
                <div className="AdminProfile-input-wrap">
                  <UserRound size={16} className="AdminProfile-icon" />
                  <input
                    type="text"
                    className="AdminProfile-input"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="AdminProfile-field">
                <label className="AdminProfile-label">Email Address (Login ID)</label>
                <div className="AdminProfile-input-wrap">
                  <Mail size={16} className="AdminProfile-icon" />
                  <input
                    type="email"
                    className="AdminProfile-input"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="AdminProfile-field">
                <label className="AdminProfile-label">Username</label>
                <div className="AdminProfile-input-wrap">
                  <Sparkles size={16} className="AdminProfile-icon" />
                  <input
                    type="text"
                    className="AdminProfile-input"
                    value={profile.username || ""}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    placeholder="e.g. art"
                  />
                </div>
              </div>

              <div className="AdminProfile-field">
                <label className="AdminProfile-label">Phone Contact</label>
                <div className="AdminProfile-input-wrap">
                  <Phone size={16} className="AdminProfile-icon" />
                  <input
                    type="tel"
                    className="AdminProfile-input"
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
            </div>

            <div className="AdminProfile-action-row">
              <button
                type="submit"
                className="AdminProfile-submit-btn"
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <>
                    <span className="AdminProfile-spinner" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === "security" && (
        <div className="AdminProfile-content-card">
          <div className="AdminProfile-card-header">
            <div>
              <h3 className="AdminProfile-section-title">Change Secret Password</h3>
              <p className="AdminProfile-section-subtitle">
                Keep your administrator account safe with a strong, private password.
              </p>
            </div>
          </div>

          {passwordMessage.text && (
            <div className={`AdminProfile-alert AdminProfile-alert--${passwordMessage.type}`}>
              {passwordMessage.type === "success" ? (
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              ) : (
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
              )}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="AdminProfile-form">
            <div className="AdminProfile-grid AdminProfile-grid--stacked">
              <div className="AdminProfile-field">
                <label className="AdminProfile-label">Current Password</label>
                <div className="AdminProfile-input-wrap">
                  <Lock size={16} className="AdminProfile-icon" />
                  <input
                    type={showCurrent ? "text" : "password"}
                    className="AdminProfile-input AdminProfile-input--pass"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, currentPassword: e.target.value })
                    }
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    className="AdminProfile-eye-btn"
                    onClick={() => setShowCurrent((p) => !p)}
                    tabIndex={-1}
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="AdminProfile-field">
                <label className="AdminProfile-label">New Password</label>
                <div className="AdminProfile-input-wrap">
                  <KeyRound size={16} className="AdminProfile-icon" />
                  <input
                    type={showNew ? "text" : "password"}
                    className="AdminProfile-input AdminProfile-input--pass"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, newPassword: e.target.value })
                    }
                    placeholder="Enter at least 6 characters"
                    required
                  />
                  <button
                    type="button"
                    className="AdminProfile-eye-btn"
                    onClick={() => setShowNew((p) => !p)}
                    tabIndex={-1}
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="AdminProfile-field">
                <label className="AdminProfile-label">Confirm New Password</label>
                <div className="AdminProfile-input-wrap">
                  <KeyRound size={16} className="AdminProfile-icon" />
                  <input
                    type={showNew ? "text" : "password"}
                    className="AdminProfile-input AdminProfile-input--pass"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirmPassword: e.target.value })
                    }
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="AdminProfile-action-row">
              <button
                type="submit"
                className="AdminProfile-submit-btn"
                disabled={savingPassword}
              >
                {savingPassword ? (
                  <>
                    <span className="AdminProfile-spinner" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Shield size={16} />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;

