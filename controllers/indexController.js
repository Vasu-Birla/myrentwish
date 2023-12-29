
import { sendTokenCompany } from '../utils/jwtToken.js';
import connection from '../config.js';
import fs from 'fs';
import path from 'path';
import Excel from 'exceljs'


//import fs from 'fs/promises';

import { PdfReader } from "pdfreader";

import { PDFDocument, degrees, rgb } from 'pdf-lib'



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

    const addSign1 = async (req, res, next) => {
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
    
            // Get the first page and add the signature image
            const page = pdfDoc.getPages()[0];
            const { width, height } = page.getSize();
            page.drawImage(signatureImage, {
                x: width - 150, // Adjust the position based on your PDF layout
                y: 50, // Adjust the position based on your PDF layout
                width: 100,
                height: 50,
            });
    
            // Save the updated PDF
            const updatedPdfBytes = await pdfDoc.save();
            fs.writeFileSync(filePath, updatedPdfBytes);

           
        
             await con.query('UPDATE tbl_rentagreements SET tenantSignStatus = ? WHERE agreement_number = ?', ['true',agreementNumber]);
            
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
    




    
    const addSign = async (req, res, next) => {
      const con = await connection();
    
      try {
        await con.beginTransaction();
    
        // Extract data from the request
        const { agreementNumber, signature } = req.body;
    
        // Load the existing PDF document
        const filePath = path.join('public', 'agreements', `${agreementNumber}.pdf`);
        const existingPdfBytes = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
        // Get the first page of the PDF document
        const page = pdfDoc.getPages()[0];
    
        // Extract text content using pdfreader
        const textContent = await extractTextContent(filePath);
    
        // Add the signature image under the specified text (assuming text "Tenant Signature:")
        const tenantSignatureText = 'Tenant Signature:';
    
        // Use a regular expression to find the position of the text
        const match = new RegExp(tenantSignatureText).exec(textContent);
    
        if (match) {
          const startIndex = match.index;
    
          // Assuming you have the signature image data URL stored in the request body
          const signatureImage = await pdfDoc.embedPng(signature);
    
          // Add the image to the page
          const { width, height } = signatureImage.image;
          const scale = 0.5; // You may need to adjust the scale
          page.drawImage(signatureImage, {
            x: 10, // Adjust the x-coordinate as needed
            y: 10, // Adjust the y-coordinate as needed
            width: width * scale,
            height: height * scale,
            rotate: degrees(0),
          });
    
          // Update the text content by removing the original text
          const updatedTextContent = textContent.substring(0, startIndex) + 'Signature Added:' + textContent.substring(startIndex + tenantSignatureText.length);
    
          // Set the modified text content to the page
          await page.drawText(updatedTextContent, { x: 10, y: 10 }); // Adjust coordinates as needed
        }
    
        // Save the modified PDF
        const modifiedPdfBytes = await pdfDoc.save();
        fs.writeFileSync(filePath, modifiedPdfBytes);
    
    
    
        await con.commit();
    
        res.redirect(`/agreements/${agreementNumber}`);
      } catch (error) {
        await con.rollback();
        console.error('Error adding signature:', error);
        res.status(500).json({ result: 'Internal Server Error' });
      } finally {
        con.release();
      }
    };
    
    async function extractTextContent(filePath) {
      return new Promise((resolve, reject) => {
        const textContent = [];
        const reader = new PdfReader();
    
        reader.parseFileItems(filePath, (err, item) => {
          if (err) {
            reject(err);
          } else if (!item) {
            resolve(textContent.join(' '));
          } else if (item.text) {
            textContent.push(item.text);
          }
        });
      });
    }

    

    
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
export {err500  , openAgreement ,addSign , successSingature , fetchprofile }


         
