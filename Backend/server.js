const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");

dotenv.config();

const connectDB = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 5000;

/* ==============================
   DATABASE
============================== */
connectDB();

/* ==============================
   MIDDLEWARE (CORS & Body Parsers)
============================== */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

/* ==============================
   STATIC UPLOADS
============================== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ==============================
   HEALTH CHECK ROUTE
============================== */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Art & Culture Backend API is running successfully",
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
  });
});

/* ==============================
   API ROUTES
============================== */
const galleryRoutes = require("./src/routes/galleryRoutes");
const couponRoutes = require("./src/routes/couponRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const artRoutes = require("./src/routes/artRoutes");
const blogRoutes = require("./src/routes/blogRoutes");
const authRoutes = require("./src/routes/authRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const userRoutes = require("./src/routes/userRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const enquiryRoutes = require("./src/routes/enquiryRoutes");
const blogCommentRoutes = require("./src/routes/blogCommentRoutes");
const adminAuthRoutes = require("./src/routes/adminAuthRoutes");
const feedbackRoutes = require("./src/routes/feedbackRoutes");
const trainingCourseRoutes = require("./src/routes/trainingCourseRoutes");
const courseEnquiryRoutes = require("./src/routes/courseEnquiryRoutes");

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/adminuser", adminAuthRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/arts", artRoutes);
app.use("/api/art-posting", artRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/blog-comments", blogCommentRoutes);
app.use("/api/reviews", blogCommentRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/training-courses", trainingCourseRoutes);
app.use("/api/training-course", trainingCourseRoutes);
app.use("/api/course-enquiries", courseEnquiryRoutes);

/* ==============================
   404 HANDLER
============================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* ==============================
   GLOBAL ERROR HANDLER
============================== */
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ==============================
   START SERVER
============================== */
app.listen(PORT, () => {
  console.log("==================================================");
  console.log(`🚀 Art & Culture Server running on port: ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log("==================================================");
});

module.exports = app;
