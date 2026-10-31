import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "./Layout/MainLayout/MainLayout";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Login from "./Pages/Login/Login";
import { clearAdminSession } from "./utils/adminAuth";

import ArtPosting from "./Components/ArtPosting/ArtPosting";
import ArtManage from "./Components/ArtManage/ArtManage";
import ArtCatagory from "./Components/ArtCatagory/ArtCatagory";
import Gallary from "./Components/Gallary/Gallary";
import Order from "./Components/Order/Order";
import Coupons from "./Components/Coupons/Coupons";
import Users from "./Components/Users/Users";
import EnquiryManagement from "./Components/EnquiryManagement/EnquiryManagement";
import BlogPosting from "./Components/BlogPosting/BlogPosting";
import BlogManagement from "./Components/BlogManagement/BlogManagement";
import ReviewManagement from "./Components/ReviewManagement/ReviewManagement";
import Feedback from "./Pages/Feedback/Feedback";
import TrainingCoursePosting from "./Pages/TrainingCoursePosting/TrainingCoursePosting";
import TrainingCourseManagement from "./Pages/TrainingCourseManagement/TrainingCourseManagement";
import TrainingCourseEnquiries from "./Pages/TrainingCourseEnquiries/TrainingCourseEnquiries";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Profile from "./Pages/Profile/Profile";

// Dedicated Logout route component
const Logout = () => {
  useEffect(() => {
    clearAdminSession();
  }, []);
  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Admin Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Redirect root URL to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected Admin Suite - Requires Valid Admin Session */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route
              path="/art-management/art-posting"
              element={<ArtPosting />}
            />

            <Route
              path="/art-management/manage-art"
              element={<ArtManage />}
            />

            <Route
              path="/art-management/category-manage"
              element={<ArtCatagory />}
            />

            <Route path="/gallery" element={<Gallary />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/users" element={<Users />} />

            <Route
              path="/enquiry-management"
              element={<EnquiryManagement />}
            />

            <Route
              path="/blog/blog-posting"
              element={<BlogPosting />}
            />

            <Route
              path="/blog/blog-management"
              element={<BlogManagement />}
            />

            <Route
              path="/review-management"
              element={<ReviewManagement />}
            />

            <Route
              path="/feedback"
              element={<Feedback />}
            />

            <Route
              path="/training-course/posting"
              element={<TrainingCoursePosting />}
            />
            <Route
              path="/training-course/management"
              element={<TrainingCourseManagement />}
            />
            <Route
              path="/training-course/enquiries"
              element={<TrainingCourseEnquiries />}
            />

            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Fallback for Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
