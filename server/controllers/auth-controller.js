const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Helper function to send email
const sendOtpEmail = async (email, otp) => {
  // Create a transporter object using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email from .env file
      pass: process.env.EMAIL_PASS, // Your email app password from .env file
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

// 1. Controller to Generate and Send OTP
const generateOtp = async (req, res) => {
  try {
    const { email, name } = req.body; // Name is optional, only needed for signup

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Set OTP expiration time to 10 minutes from now
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    let user = await User.findOne({ email });

    // If user does not exist, create a new one (signup flow)
    if (!user) {
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Name is required for signing up.",
        });
      }
      user = new User({
        name,
        email,
        otp,
        otpExpires,
      });
    } else {
      // If user exists, update their OTP (login flow)
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();

    // Send the OTP to the user's email
    await sendOtpEmail(email, otp);

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${email}`,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error generating OTP. Please try again.",
    });
  }
};

// 2. Controller to Verify OTP and Login/Signup User
const verifyOtpAndLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please sign up first.",
      });
    }

    // Check if OTP is correct and not expired
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    // Clear the OTP fields after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Create a JWT token for the user session
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" } // Set a longer expiry for the token
    );

    res.status(200).json({
      success: true,
      message: "Login successful!",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });
  }
};

module.exports = { generateOtp, verifyOtpAndLogin };