const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    googleId: {
      type: String,
      default: "",
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "artist", "admin", "Customer", "Admin", "Artist"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Blocked"],
      default: "Active",
    },
    avatar: {
      type: String,
      default: "",
    },
    cart: {
      type: Array,
      default: [],
    },
    wishlist: {
      type: Array,
      default: [],
    },
    addresses: [
      {
        fullName: {
          type: String,
          required: [true, "Full name is required"],
          trim: true,
        },
        phone: {
          type: String,
          required: [true, "Phone number is required"],
          trim: true,
        },
        street: {
          type: String,
          required: [true, "Street address is required"],
          trim: true,
        },
        city: {
          type: String,
          required: [true, "City is required"],
          trim: true,
        },
        state: {
          type: String,
          required: [true, "State is required"],
          trim: true,
        },
        pinCode: {
          type: String,
          required: [true, "PIN Code is required"],
          trim: true,
        },
        country: {
          type: String,
          default: "India",
          trim: true,
        },
        addressType: {
          type: String,
          enum: ["Home", "Office", "Studio", "Other"],
          default: "Home",
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    refreshToken: {
      type: String,
      default: "",
      select: false,
    },
    resetPasswordCode: {
      type: String,
      default: "",
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

