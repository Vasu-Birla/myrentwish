
import { sendTokenCompany } from '../utils/jwtToken.js';
import connection from '../config.js';
import fs from 'fs';
import path from 'path';
import Excel from 'exceljs'


//import fs from 'fs/promises';

import { PdfReader } from "pdfreader";

import { PDFDocument, degrees, rgb } from 'pdf-lib'


import puppeteer from 'puppeteer';






const home = async(req,res,next)=>{

      res.redirect('/admin')


  }



const openAgreement = async(req,res,next)=>{
  console.log("Openning Agreement ....")
    const con = await connection();

    try {

        const { agreementNumber } = req.params;
        const filePath = `http://${process.env.Host1}/agreements/${agreementNumber}.pdf`   

        const [[result]] = await con.query('SELECT tenantSignStatus FROM tbl_rentagreements WHERE agreement_number = ?', [agreementNumber]);

       if(result.tenantSignStatus == 'true'){
        console.log("ALready Signed Agreement -->  ", agreementNumber)

        res.render('viewAgreement', { filePath, agreementNumber , tenantSignStatus:true });
       
       }else{

        console.log("Yet to Sign -->  ", agreementNumber)
        res.render('viewAgreement', { filePath, agreementNumber , tenantSignStatus:false});
       }
       
        
    } catch (error) {
        console.log("Error in Opening Agrement --- > ", error)
        res.render('kilvish500', {'output':'Internal Server Error'});
    }finally{
        con.release()
    }  
  
    }

    const addSign = async (req, res, next) => {
        const con = await connection();
        try {
            const { agreementNumber, signature } = req.body;

    
            // Load the existing PDF
            const filePath = path.join('public', 'agreements', `${agreementNumber}.pdf`);
            const pdfBytes = fs.readFileSync(filePath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
    
            // Convert the signature data URL to a buffer
            const signatureImageBytes = await convertDataUrlToBuffer(signature);
    
            // Embed the signature image into the PDF
            const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
    
            // // Get the first page and add the signature image
            // const page = pdfDoc.getPages()[0];
            // const { width, height } = page.getSize();
            // page.drawImage(signatureImage, {
            //     x: width - 150, // Adjust the position based on your PDF layout
            //     y: 50, // Adjust the position based on your PDF layout
            //     width: 100,
            //     height: 50,
            // });


            const lastPageIndex = pdfDoc.getPageCount() - 1;
const lastPage = pdfDoc.getPages()[lastPageIndex];
const { width, height } = lastPage.getSize();
lastPage.drawImage(signatureImage, {
  x: width - 150, // Adjust the position based on your PDF layout
  y: 50, // Adjust the position based on your PDF layout
  width: 100,
  height: 50,
});
    
            // Save the updated PDF
            const updatedPdfBytes = await pdfDoc.save();
            fs.writeFileSync(filePath, updatedPdfBytes);

           
        
           //  await con.query('UPDATE tbl_rentagreements SET tenantSignStatus = ? WHERE agreement_number = ?', ['true',agreementNumber]);
            
            res.redirect(`/agreements/${agreementNumber}`);
            
    
            // Redirect to a success page or send a success response
            //res.json({ result: 'success', message: 'Signature added successfully' });
        } catch (error) {
            console.error('Error adding signature:', error);
            res.status(500).json({ result: 'Internal Server Error' });
        }finally{
            con.release()
        }
    };
    


    
    
    // Convert a data URL to a buffer
    async function convertDataUrlToBuffer(dataUrl) {
        const [, base64Data] = dataUrl.match(/^data:image\/png;base64,(.*)$/);
        return Buffer.from(base64Data, 'base64');
    }


    const successSingature = async(req,res,next)=>{

                try {
                    const { agreementNumber } = req.params;
                    res.render('success', { agreementNumber });
                    
                } catch (error) {
                    res.render('kilvish500', {'output':'Internal Server Error'});
                    
                }
                
      
        }



    
        

const fetchprofile = async(req,res,next)=>{

      try {

        res.render('fetchprofile',{"profileData":""})
        
      } catch (error) {

        console.log(error)
      res.render('kilvish500', {'output':'Internal Server Error'});
        
      }



  }
    
  
const err500 = async(req,res,next)=>{

  res.render('kilvish500', {'output':'Internal Server Error'});


  }


    


  //--------------------- Export Start ------------------------------------------
export {err500  , openAgreement ,addSign , successSingature , fetchprofile , home }


         
