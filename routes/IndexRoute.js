import express from 'express'



import {addSign, err500, fetchprofile, openAgreement, successSingature  } from '../controllers/indexController.js';
import { getOnlyFansProfile } from '../controllers/indexControllerAPI.js';

const router = express.Router(); 


//------------- Routing Start -----------------------


router.route('/err500').get(err500)

router.route('/agreements/:agreementNumber').get(openAgreement)

router.route('/sign').post(addSign)

router.route('/agreements/:agreementNumber/success').get(successSingature)


router.route('/fetch-profile').get(fetchprofile)
router.route('/fetch-profile').post(getOnlyFansProfile)




export default router





















