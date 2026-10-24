import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home/Home";
import BlogDetails from "./Pages/BlogDetails/BlogDetails";
import CollectionDetails from "./Pages/CollectionDetails/CollectionDetails";



const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/blog-details" element={<BlogDetails />} />
       <Route path="/collection-details" element={<CollectionDetails />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;