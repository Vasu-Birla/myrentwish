import express from 'express'
import multer from 'multer';
import upload from '../middleware/upload.js';

import {isAuthenticatedUser} from '../middleware/auth.js'

import { register ,Login, Logout,  ForgotPassword ,
    resetpassword,
    profile,
    obtainToken,
    updateProfile,
    updatePreference,
    addProperty,
    property,
    Properties,
    myProperties,
    updateProperty,
    deleteProperty,
    addToInterest,
    getQuestions,
    addAnswer,
    removeAccount,
    propTypes,
    getSkills,
    contactUs,
    myTickets,
    tandc,
    pandp,
    faqs,
    checkPreferenceAvailability,
    createPDFWithSignatureField,
    fetchcountries,
    fetchCities,
    isActive} from '../controllers/apiController.js';

const router = express.Router(); 

//router.use(upload.none());


//=================================  API Routing Start ==================================




//------------- USer Profile Section  ----------------

router.route('/register').post( upload.none(),register);

router.route('/login').post( upload.none(),Login);

router.route('/logout').get( Logout);

router.route('/forgotpassword').post( upload.none(),ForgotPassword );

router.route('/resetpassword').post( upload.none(),resetpassword);


router.route('/profile').post(upload.none(),profile)

router.route('/updateprofile').post(upload.single('image'),updateProfile)




router.route('/removeAccount').post(upload.none(),removeAccount)



router.route('/updatePreference').post(upload.none(),updatePreference)

router.route('/checkPreference').post(upload.none(),checkPreferenceAvailability)





router.route('/getSkills').get(upload.none(),getSkills)


//------------- Property Section ------------------- 


router.route('/addProperty').post(upload.array('images'),addProperty)

router.route('/properties').post(upload.none(),Properties)

router.route('/myProperties').post(upload.none(),myProperties)

router.route('/property').post(upload.none(),property)

router.route('/updateProperty').post(upload.array('images'),updateProperty)


router.route('/deleteProperty').post(upload.none(),deleteProperty)


router.route('/addToInterest').post(upload.none(),addToInterest)

router.route('/propTypes').get(upload.none(),propTypes)




//------- question section ---------  

router.route('/getQuestions').post(upload.none(),getQuestions)

router.route('/addAnswer').post(upload.none(),addAnswer)




//------------  contact us ---------------------  


router.route('/contactUs').post(upload.none(),contactUs)

router.route('/myTickets').post(upload.none(),myTickets)





//---------------- Terms and condition  , Privacy and FAQ  webview  ----------- 



router.route('/tandc').get(upload.none(),tandc)

router.route('/pandp').get(upload.none(),pandp)

router.route('/faqs').get(upload.none(),faqs)





//----------------- Push Notification Section ------------------- 


router.route('/getToken').post(upload.none(), obtainToken )



//---------Agreement Section ------

router.route('/generateagreement').post(upload.none(),createPDFWithSignatureField)


router.route('/fetchcountries').get(upload.none(),fetchcountries)

router.route('/fetchCities').post(upload.none(),fetchCities)




//--------- isActive

router.route('/isActive').post(upload.none(),isActive)


export default router