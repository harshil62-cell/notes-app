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
 *     summary: Generate OTP for user login
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
 *     summary: Verify OTP and login user
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
 *         description: Invalid OTP
 */

const express=require('express');
const{generateOtp,verifyOtpAndLogin}=require('../controllers/auth-controller');
const router=express.Router();

router.post('/generate-otp',generateOtp);
router.post('/verify-otp', verifyOtpAndLogin);

module.exports = router;