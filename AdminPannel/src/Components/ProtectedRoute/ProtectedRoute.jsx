import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAdminAuthenticated, verifyAdminSession } from "../../utils/adminAuth";

/**
 * ProtectedRoute component for Admin Panel
 * Validates JWT token and redirects unauthenticated visitors to /login
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated());

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      if (!isAdminAuthenticated()) {
        if (isMounted) {
          setIsAuthenticated(false);
          setChecking(false);
        }
        return;
      }

      // Verify JWT with backend
      const isValid = await verifyAdminSession();
      if (isMounted) {
        setIsAuthenticated(isValid);
        setChecking(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (checking) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#160c06",
          color: "#c99432",
          flexDirection: "column",
          gap: "14px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            border: "3px solid rgba(201, 148, 50, 0.2)",
            borderTopColor: "#c99432",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ fontSize: "14px", letterSpacing: "1px" }}>
          Verifying Admin Access...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
