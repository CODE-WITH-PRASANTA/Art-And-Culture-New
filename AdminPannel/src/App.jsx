
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


import MainLayout from "./Layout/MainLayout/MainLayout";

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
import Dashboard from "./Pages/Dashboard/Dashboard"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect the root URL to Dashboard */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Main layout for all dashboard pages */}
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
        </Route>

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
