
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
import Training from "./Pages/Training/Training";
import OnlineArt from "./Pages/OnlineArt/OnlineArt";
import ClassDetails from "./Pages/ClassDetails/ClassDetails";
import RequestArtClass from "./Pages/RequestArtClass/RequestArtClass";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Main pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/shop-details" element={<ShopDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-account" element={<MyAccount/>} />
        <Route path="/terms-and-conditions" element={<TermAndCondition/>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
        <Route path="/support" element={<SupportMain/>} />

        {/* Blog and collection pages */}
        <Route path="/blog-details" element={<BlogDetails />} />
        <Route
          path="/collection-details"
          element={<CollectionDetails />}
        />
        <Route path="/blog" element={<Blog />} />
        <Route path="/gallary" element={<Gallary />} />
        <Route path="/training-and-course" element={<Training />} />
         <Route path="/online-art-class" element={<OnlineArt />} />
         <Route path="/class-details" element={<ClassDetails />} />
         <Route path="/request-art-class" element={<RequestArtClass />} />

      </Routes>
      <FloatingIcons/>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
