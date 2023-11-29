import express from 'express'
import { Profile, ProfilePost, changepass, checkPass, 
    homePage, loginAdmin, loginPage, logout, updateadminpic } from '../controllers/adminController.js';


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




export default router