import express from 'express'



import upload from '../middleware/upload.js';
import {  imageUpload, fileUpload } from '../middleware/uploader.js'
import { isAuthenticatedCompany } from '../middleware/Companyauth.js' ;

import {comapnyHome,  login, loginCompany,  logout, ForgotPassword,sendOTP,verifyOTP,resetpassword,
   changepass, err500, profile, updateCompanypic, ProfilePost,

    } from '../controllers/indexController.js';

const router = express.Router(); 


//------------- Routing Start -----------------------

router.route('/').get(comapnyHome)


router.route('/login').get(login)

router.route('/login').post(loginCompany)

router.route('/logout').get(logout)



//------------------------- Forgot Reset Password ----------------

router.route('/sendOTP').post(sendOTP)

router.route('/verify-otp').post(verifyOTP)

router.route('/reset-password').post(resetpassword)




// Company Profile Section 

router.route('/profile').get(isAuthenticatedCompany,profile)

router.route('/profile').post(isAuthenticatedCompany,upload.single('image'),ProfilePost)

router.route('/changepass').post(isAuthenticatedCompany ,changepass)

router.route('/updateCompanypic').post(isAuthenticatedCompany,upload.single('image'),updateCompanypic)

router.route('/ForgotPassword').get(ForgotPassword)

router.route('/err500').get(isAuthenticatedCompany,err500)


export default router





















