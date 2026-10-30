const Razorpay = require("razorpay");

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_TppGgVggUkbJv4";
  const key_secret = process.env.RAZORPAY_KEY_SECRET || "PMTMnawtXe2ZEHUUPT2JMzoN";

  if (!key_id || !key_secret) {
    throw new Error("Razorpay Key ID and Secret must be defined in environment");
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

module.exports = { getRazorpayInstance };

