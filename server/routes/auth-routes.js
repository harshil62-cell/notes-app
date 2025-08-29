const express=require('express');
const{generateOtp,verifyOtpAndLogin}=require('../controllers/auth-controller');
const router=express.Router();


router.post('/generate-otp',generateOtp);
router.post('/verify-otp', verifyOtpAndLogin);

module.exports = router;