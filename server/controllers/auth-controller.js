const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

const generateOtp = async (req, res) => {
  try {
    const { email, name } = req.body; 

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    let user = await User.findOne({ email });

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
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();

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

const verifyOtpAndLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please sign up first.",
      });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" } 
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