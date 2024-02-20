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
    agreements,
    createPDFWithSignatureField,
    getOnlyFansProfile,
    fetchCities,
    fetchcountries,
    isActive,
    loginOTP,
    userList,
    switchType,
    totalAnswered,
    answeredQuestions,
    PropertiesFilter} from '../controllers/indexControllerAPI.js';

const router = express.Router(); 

//router.use(upload.none());


//=================================  API Routing Start ==================================




//------------- USer Profile Section  ----------------

router.route('/register').post( upload.none(),register);

router.route('/login').post( upload.none(),Login);

router.route('/logout').get( Logout);



router.route('/signupOTP').post( upload.none(),loginOTP);

router.route('/forgotpassword').post( upload.none(),ForgotPassword );

router.route('/resetpassword').post( upload.none(),resetpassword);


router.route('/profile').post(upload.none(),profile)

router.route('/updateprofile').post(upload.single('image'),updateProfile)




router.route('/removeAccount').post(upload.none(),removeAccount)



router.route('/updatePreference').post(upload.none(),updatePreference)

router.route('/checkPreference').post(upload.none(),checkPreferenceAvailability)





router.route('/getSkills').get(upload.none(),getSkills)


//---------- fetch top percentage users --------


router.route('/userList').post(upload.none(),userList)



//------------- Property Section ------------------- 


router.route('/addProperty').post(upload.array('images'),addProperty)

router.route('/properties').post(upload.none(),Properties)

router.route('/fiterproperties').post(upload.none(),PropertiesFilter)

router.route('/myProperties').post(upload.none(),myProperties)

router.route('/property').post(upload.none(),property)

router.route('/updateProperty').post(upload.array('images'),updateProperty)


router.route('/deleteProperty').post(upload.none(),deleteProperty)


router.route('/addToInterest').post(upload.none(),addToInterest)

router.route('/propTypes').get(upload.none(),propTypes)




//------- question section ---------  

router.route('/getQuestions').post(upload.none(),getQuestions)

router.route('/addAnswer').post(upload.none(),addAnswer)

router.route('/anscount').post(upload.none(),totalAnswered)

router.route('/totalanswered').post(upload.none(),answeredQuestions)







//------------  contact us ---------------------  


router.route('/contactUs').post(upload.none(),contactUs)

router.route('/myTickets').post(upload.none(),myTickets)





//---------------- Terms and condition  , Privacy and FAQ  webview  ----------- 



router.route('/tandc').get(upload.none(),tandc)

router.route('/pandp').get(upload.none(),pandp)

router.route('/faqs').get(upload.none(),faqs)

router.route('/agreements').get(upload.none(),agreements)




//--------------- rent agreement pdf ------------


router.route('/pdf').post(upload.none(),createPDFWithSignatureField)



//-----------------  fetchCities ------------ 


router.route('/fetchcountries').get(upload.none(),fetchcountries)
router.route('/fetchCities').post(upload.none(),fetchCities)




//--------- isActive

router.route('/isActive').post(upload.none(),isActive)


















//----------------- Push Notification Section ------------------- 


router.route('/getToken').post(upload.none(), obtainToken )








router.route('/scrape_onlyfans_profile').get(upload.none(), getOnlyFansProfile )


router.route('/switchType').post(upload.none(), switchType )








export default router