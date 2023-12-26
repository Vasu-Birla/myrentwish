import express from 'express'



import {addSign, err500, openAgreement, successSingature  } from '../controllers/indexController.js';

const router = express.Router(); 


//------------- Routing Start -----------------------


router.route('/err500').get(err500)

router.route('/agreements/:agreementNumber').get(openAgreement)

router.route('/sign').post(addSign)

router.route('/agreements/:agreementNumber/success').get(successSingature)

export default router





















