import express from 'express'
import { Profile, ProfilePost, addInquiryDetails, addQuestion, addSkills, addUser, changepass, checkPass, 
    homePage, loginAdmin, loginPage, logout, notification, propType, properties, queries, tandc, updateadminpic, userPrivacy, viewQuestions, viewSkills, viewUsers } from '../controllers/adminController.js';


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


//------- user section --------- 

router.route('/addUser').get(addUser)

router.route('/viewUsers').get(viewUsers)


//------ prop type -------------

router.route('/propType').get(propType)

router.route('/properties').get(properties)



//--------questions 


router.route('/addQuestion').get(addQuestion)

router.route('/viewQuestions').get(viewQuestions)



//------- Skills --- 

router.route('/addSkills').get(addSkills)

router.route('/viewSkills').get(viewSkills)


//------ notification 
router.route('/notify').get(notification)


//--------- Useer Privacy ------------

router.route('/userPrivacy').get(userPrivacy)


//------- Terms & Condition -----------


router.route('/tandc').get(tandc)

//---------- FAQ ------

router.route('/faq').get(tandc)




//--------------  addInquiryDetails ---------


router.route('/addInquiryDetails').get(addInquiryDetails)


//---------------- view queries Tickets ------------


router.route('/queries').get(queries)









export default router