/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /api/generate-otp:
 *   post:
 *     summary: Send OTP to user's email for authentication
 *     description: Generates a 6-digit OTP and sends it to the user's email. If the user does not exist, a new user is created. OTP is valid for 10 minutes.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent to user
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/verify-otp:
 *   post:
 *     summary: Verify OTP and log in user
 *     description: Verifies the OTP sent to the user's email. If valid, logs in the user and returns a JWT access token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid or expired OTP
 */

const express=require('express');
const{generateOtp,verifyOtpAndLogin}=require('../controllers/auth-controller');
const router=express.Router();

router.post('/generate-otp',generateOtp);
router.post('/verify-otp', verifyOtpAndLogin);

module.exports = router;