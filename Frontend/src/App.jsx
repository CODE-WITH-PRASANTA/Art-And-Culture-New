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



const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/about-us" element={<AboutUs/>} />
       <Route path="/contact" element={<Contact/>} />
       <Route path="/shop" element={<Shop/>} />
       <Route path="/faq" element={<Faq/>} />
       <Route path="/shop-details" element={<ShopDetails/>} />
       <Route path="/wishlist" element={<Wishlist/>} />
       <Route path="/cart" element={<Cart/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;