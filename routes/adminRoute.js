import express from 'express'
import { Deleteskill, ForgotPassword, Profile, ProfilePost, QueriesPost, SupportPost, addFAQ, addInquiryDetails, addQuestion, addQuestionPost, addSkills, addUser, appPass, appPassPost, changepass, checkPass, 
    deleteFAQ, 
    deleteProperty, 
    deleteSkill, 
    deleteUser, 
    deleteUser1, 
    deletepQues, 
    deletepropType, 
    deletetandc, 
    deleteuserPrivacy, 
    editFAQ, 
    faq,  
    homePage, loginAdmin, loginPage, logout, notification,
     propType, propTypePost, properties, queries, resetpassword, sendMailtoUser, sendOTP, skills, skillsPost, tandc, 
     tandcPost, 
     updatePropertyStatus, updateUserStatus, updateadminpic,
      updatepropType, userPrivacy, userPrivacyPost, verifyOTP, viewQuestion, viewQuestionPost, viewQuestions, viewSkills, viewUser, viewUserPost, viewUsers } from '../controllers/adminController.js';


import upload from '../middleware/upload.js';
import { isAuthenticatedAdmin} from '../middleware/Adminauth.js' ;

const router = express.Router(); 



//------------- Routing Start -----------------------

router.route('/').get(isAuthenticatedAdmin,homePage)


router.route('/profile').get(isAuthenticatedAdmin,Profile)


router.route('/profile').post(isAuthenticatedAdmin,upload.single('image'),ProfilePost)

router.route('/updateadminpic').post(isAuthenticatedAdmin,upload.single('image'),updateadminpic)

router.route('/changepass').post(isAuthenticatedAdmin,changepass)



router.route('/login').get(loginPage)

router.route('/login').post(loginAdmin)


router.route('/checkPass').post(checkPass)


router.route('/logout').get(logout)



//------------------------- Forgot Reset Password ----------------

router.route('/ForgotPassword').get(ForgotPassword)

router.route('/sendOTP').post(sendOTP)

router.route('/verify-otp').post(verifyOTP)

router.route('/reset-password').post(resetpassword)


//------- user section --------- 

router.route('/addUser').get(addUser)

router.route('/viewUsers').get(viewUsers)

router.route('/viewUser').get(viewUser)

router.route('/viewUser').post(viewUserPost)

router.route('/updateUserStatus').post(updateUserStatus)


router.route('/deleteUser').get(deleteUser)

router.route('/deleteUser').delete(deleteUser1)









//------ prop type -------------

router.route('/propType').get(propType)

router.route('/propType').post(propTypePost)

router.route('/updatepropType').post(updatepropType)

router.route('/deletepropType').delete(deletepropType)






router.route('/properties').get(properties)

router.route('/deleteProperty').delete(deleteProperty)

router.route('/updatePropertyStatus').post(updatePropertyStatus)






//--------questions 


router.route('/addQuestion').get(addQuestion)

router.route('/addQuestion').post(addQuestionPost)


router.route('/viewQuestions').get(viewQuestions)

router.route('/viewQuestion').get(viewQuestion)


router.route('/viewQuestion').post(viewQuestionPost)

router.route('/deletepQues').delete(deletepQues)







//------- Skills --- 



router.route('/skills').get(skills)

router.route('/skills').post(skillsPost)

router.route('/addSkills').get(addSkills)

router.route('/viewSkills').get(viewSkills)


router.route('/deleteSkill').delete(deleteSkill)


router.route('/delskills').get(Deleteskill)






//------ notification 
router.route('/notify').get(notification)


//--------- Useer Privacy ------------

router.route('/userPrivacy').get(userPrivacy)

router.route('/userPrivacy').post(userPrivacyPost)


router.route('/deleteuserPrivacy').get(deleteuserPrivacy)




//------- Terms & Condition -----------


router.route('/tandc').get(tandc)

router.route('/tandc').post(tandcPost)

router.route('/deletetandc').get(deletetandc)






//---------- FAQ ------

router.route('/faq').get(faq)


router.route('/faq').post(addFAQ)

router.route('/deleteFAQ').get(deleteFAQ)

router.route('/editFAQ').post(editFAQ)







//--------------  addInquiryDetails ---------


router.route('/addInquiryDetails').get(addInquiryDetails)

router.route('/addInquiryDetails').post(SupportPost)


//---------------- view queries Tickets ------------


router.route('/queries').get(queries)

router.route('/queries').post( QueriesPost)

router.route('/sendemail').post( sendMailtoUser)


//--------- add Google App pass to send Emails ---------


router.route('/appPass').get(appPass)

router.route('/appPass').post(appPassPost)






export default router