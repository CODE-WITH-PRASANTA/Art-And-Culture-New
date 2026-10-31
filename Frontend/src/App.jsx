import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

import Home from "./Pages/Home/Home";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Contact from "./Pages/Contact/Contact";
import Shop from "./Pages/Shop/Shop";
import Faq from "./Pages/Faq/Faq";
import ShopDetails from "./Pages/ShopDetails/ShopDetails";
import Wishlist from "./Pages/Wishlist/Wishlist";
import Cart from "./Pages/Cart/Cart";

import BlogDetails from "./Pages/BlogDetails/BlogDetails";
import CollectionDetails from "./Pages/CollectionDetails/CollectionDetails";
import MyAccount from "./Components/MyAccount/MyAccount";
import FloatingIcons from "./Components/FloatingIcons/FloatingIcons";
import TermAndCondition from "./Pages/TermAndCondition/TermAndCondition";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy";
import SupportMain from "./Components/SupportMain/SupportMain";
import Blog from "./Components/Blog/Blog";
import Gallary from "./Pages/Gallary/Gallary";
import Coupons from "./Pages/Coupons/Coupons";
import Training from "./Pages/Training/Training";
import ClassDetails from "./Pages/ClassDetails/ClassDetails";
import RequestArtClass from "./Pages/RequestArtClass/RequestArtClass";
import OrderDetails from "./Pages/OrderDetails/OrderDetails";

import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Navbar />

          <Routes>
          {/* Main pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:artName" element={<ShopDetails />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/shop-details" element={<ShopDetails />} />
          <Route path="/shop-details/:artName" element={<ShopDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/order-details/:orderId" element={<OrderDetails />} />
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/terms-and-conditions" element={<TermAndCondition />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/support" element={<SupportMain />} />

          {/* Blog and collection pages */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          <Route path="/blog-details" element={<BlogDetails />} />
          <Route path="/blog-details/:slug" element={<BlogDetails />} />
          <Route
            path="/collection-details"
            element={<CollectionDetails />}
          />
          <Route path="/gallary" element={<Gallary />} />
          <Route path="/training-and-course" element={<Training />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/class-details" element={<ClassDetails />} />
          <Route path="/request-art-class" element={<RequestArtClass />} />
        </Routes>

        <FloatingIcons />

        <Footer />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </BrowserRouter>
  );
};

export default App;
