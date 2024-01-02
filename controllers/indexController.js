
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

    const openAgreementOwner = async(req,res,next)=>{
      console.log("Openning Agreement by Owner....")
        const con = await connection();
    
        try {
    
            const { agreementNumber } = req.params;
            const filePath = `http://${process.env.Host1}/agreements/${agreementNumber}.pdf` 
        
            res.render('viewAgreementowner', { filePath, agreementNumber });           
            
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

        const { agreementNumber, signature } = req.body;
          const [rentAgreementData] = await con.query('SELECT * FROM tbl_rentagreements WHERE agreement_number = ?', [agreementNumber]);

          if (!rentAgreementData || rentAgreementData.length === 0) {
            throw new Error('Rent agreement not found');
          }

          const {owner_id, tenant_id, monthly_amount, start_date, end_date, ownersigndata , template_num , currency , agreementtext ,created_at } = rentAgreementData[0];
        
          const [tenantQuery] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [tenant_id]);

          const [ownerQuery] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [owner_id]);
      
          const tenantEmail = tenantQuery[0].user_email;
          const ownerEmail = ownerQuery[0].user_email;
          const tenant = tenantQuery[0].firstname + ' ' + tenantQuery[0].lastname;
          const owner = ownerQuery[0].firstname + ' ' + ownerQuery[0].lastname;

         var landlordSignature =  ownersigndata
         var tenantSignature =  signature

         
         

        const landlordDate = new Date(created_at).toISOString().split('T')[0];
         var currentDate = new Date().toISOString().split('T')[0]
         var agreementData;

         if(template_num == '1'){
           console.log("Template 1 selected for Agreement ")
         
         
           
         // 1. Create a dynamic HTML template for the rent agreement
          agreementData = `
         <html>
           <head>
             <style>
               body {
                 font-family: 'Arial', sans-serif;
                 margin: 0.25in 1in 1in 1in;
                 color: #333;
                 line-height: 1.6;
               }
         
               h1 {
                 text-align: center;
                 text-decoration: underline;
                 color: #0066cc;
               }
         
               .section {
                 margin-top: 20px;
               }
         
               .owner, .tenant {
                 font-weight: bold;
               }
         
               .date {
                 font-style: italic;
               }
         
               .highlight {
                 background-color: #ffff99;
                 padding: 2px 5px;
                 border-radius: 3px;
               }
         
               .terms {
                 margin-top: 30px;
               }
         
               .terms h2 {
                 color: #0066cc;
                 margin-bottom: 10px;
               }
         
               .terms p {
                 margin-bottom: 15px;
               }
         
               .signature {
                 margin-top: 40px;
               }
         
               .signature img {
                 width: 200px;
                 height: 100px;
                 border: 2px solid #0066cc;
                 border-radius: 5px;
               }
         
               .sign-block {
                 display: flex;
                 justify-content: space-between;
                 margin-top: 30px;
               }
         
               .sign-block .landlord-signature, .sign-block .tenant-signature {
                 text-align: center;
               }
         
               .sign-block .landlord-signature img, .sign-block .tenant-signature img {
                 width: 120px;
                 height: 60px;
                 border: 2px solid #0066cc;
                 border-radius: 5px;
               }
         
               .footer {
                 margin-top: 20px;
                 font-size: 10px;
                 text-align: center;
                 color: #666;
               }
             </style>
           </head>
           <body>
             <h1>Rent Agreement</h1>
         
             <div class="section">
               <p class="owner">Landlord: ${owner}</p>
               <p class="tenant">Tenant: ${tenant}</p>
             </div>
         
             <div class="section">
               <p>Monthly Amount: ${currency}. ${monthly_amount}</p>
               <p>Start Date: ${start_date}</p>
               <p>End Date: ${end_date}</p>
               <p class="highlight">Agreement Number: ${agreementNumber}</p>
             </div>
         
             <div class="terms">
         
               <p> ${agreementtext}</p>
             
               <h2>Terms and Conditions</h2>
         
               <p><strong>1. Rent Payment:</strong> The tenant agrees to pay the monthly rent on or before the specified due date. Late payments may incur fees as outlined in this agreement.</p>
         
               <p><strong>2. Property Maintenance:</strong> The tenant is responsible for maintaining the property in good condition and promptly reporting any damages to the landlord.</p>
         
               <p><strong>3. Utilities:</strong> The agreement specifies which utilities are included in the rent and which are the responsibility of the tenant.</p>
         
               <p><strong>4. Repairs and Maintenance:</strong> The landlord agrees to promptly address necessary repairs and maintenance, and the tenant agrees to report any issues promptly.</p>
         
               <!-- Add more terms and conditions as needed -->
         
             </div>
         
             <div class="sign-block">
               <div class="landlord-signature">
               
                 <p>Date : ${landlordDate}</p>
                 <p>Landlord Signature</p>
                 <img src="${landlordSignature}" alt="Landlord's Signature">
               </div>
               <div class="tenant-signature">
                 <p>Date : ${currentDate} </p>
                 <p>Tenant Signature  </p>
                 <img src="${tenantSignature}" alt="Landlord's Signature">
               </div>
             </div>
         
             <div class="footer">
               <p>This agreement is effective as of the date first above written and is made by and between the parties identified above.</p>
             </div>
           </body>
         </html>
         `;
         
         
         }else if(template_num == '2'){
           console.log("Template 2 selected for Agreement ")
         
         
          // Create a dynamic HTML template for the rent agreement
         agreementData = `
         <html>
           <head>
             <style>
               body {
                 font-family: 'Arial', sans-serif;
                 margin: 1.25in;
                 color: #333;
                 line-height: 1.6;
               }
         
               h1 {
                 text-align: center;
                 text-decoration: underline;
                 color: #005c99;
                 margin-bottom: 20px;
               }
         
               .section {
                 margin-top: 20px;
               }
         
               .party {
                 font-weight: bold;
               }
         
               .date {
                 font-style: italic;
               }
         
               .highlight {
                 background-color: #ffffcc;
                 padding: 2px 5px;
                 border-radius: 3px;
               }
         
               .terms {
                 margin-top: 30px;
               }
         
               .terms h2 {
                 color: #005c99;
                 margin-bottom: 10px;
               }
         
               .terms p {
                 margin-bottom: 15px;
               }
         
               .signature {
                 margin-top: 40px;
                 text-align: center;
               }
         
               .signature img {
                 width: 200px;
                 height: 100px;
                 border: 2px solid #005c99;
                 border-radius: 5px;
               }
         
               .footer {
                 margin-top: 20px;
                 font-size: 10px;
                 text-align: center;
                 color: #777;
               }
             </style>
           </head>
           <body>
             <h1>Rent Agreement</h1>
         
             <div class="section">
               <p class="party">Landlord: ${owner}</p>
               <p class="party">Tenant: ${tenant}</p>
             </div>
         
             <div class="section">
               <p>Monthly Rent: ${currency}${monthly_amount}</p>
               <p>Lease Start Date: ${start_date}</p>
               <p>Lease End Date: ${end_date}</p>
               <p class="highlight">Agreement Number: ${template_num}</p>
             </div>

             
    
    <h4>ADDITIONAL TERMS: </h4>
    <p class="additional-terms">${agreementtext}</p>
         
             <div class="terms">
               <h2>Terms and Conditions</h2>
         
               <p><strong>1. Rent Payment:</strong> The tenant agrees to pay the monthly rent on or before the specified due date. Late payments may result in penalties as outlined in this agreement.</p>
         
               <p><strong>2. Property Maintenance:</strong> The tenant is responsible for keeping the property clean and reporting any damages promptly to the landlord.</p>
         
               <p><strong>3. Utilities:</strong> The tenant is responsible for the payment of utilities unless otherwise specified in this agreement.</p>
         
               <p><strong>4. Repairs and Maintenance:</strong> The landlord agrees to address necessary repairs and maintenance promptly, and the tenant agrees to report any issues without delay.</p>
         
               <!-- Add more terms and conditions as needed -->
         
             </div>
         
             <div class="signature">
             <p>Date : ${landlordDate}</p>
               <p>Landlord's Signature</p>
               <img src="${landlordSignature}" alt="Landlord's Signature">
             </div>
         
             <div class="signature">
             <p>Date : ${currentDate}</p>
               <p>Tenant's Signature </p>
                
               <img src="${tenantSignature}" alt="Landlord's Signature">
             </div>
         
             <div class="footer">
               <p>This agreement is effective as of the date first above written and is entered into by and between the parties identified above.</p>
             </div>
           </body>
         </html>
         `;
         
         
         
         
         }else{
           console.log("Template 3 selected for Agreement ")
         
         
          agreementData = `
         <!DOCTYPE html>
         <html lang="en">
         <head>
           <meta charset="UTF-8">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Rental Agreement</title>
           <style>
             body {
               font-family: 'Arial', sans-serif;
               line-height: 1.6;
               margin: 0;
               padding: 0;
               background-color: #f5f5f5;
             }
         
             .container {
               max-width: 800px;
               margin: 20px auto;
               padding: 20px;
               background-color: #fff;
               box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
             }
         
             h1, h2 {
               text-align: center;
               color: #333;
             }
         
             p {
               text-align: justify;
               margin-bottom: 10px;
               color: #555;
             }
         
             .signature {
               display: flex;
               justify-content: space-between;
               align-items: center;
               margin-top: 30px;
             }
         
             .signature img {
               max-width: 150px;
               height: auto;
             }
         
             .signature p {
               width: 48%;
               text-align: center;
             }
         
             .witness {
               margin-top: 20px;
             }
         
             .witness p {
               text-align: center;
             }
         
             .additional-terms {
               margin-top: 20px;
               color: #555;
             }
           </style>
         </head>
         <body>
           <div class="container">
             <h1>Rental Agreement</h1>
         
             <p>This Rental Agreement (the "Agreement") is entered into on ${start_date}, by and between:</p>
         
             <h2>LANDLORD:</h2>
             <p>${owner}</p>
         
             <h2>TENANT:</h2>
             <p>${tenant}</p>
         
             <h2>1. PROPERTY DETAILS:</h2>
             <p>The Landlord agrees to rent the property located at [Property Address] (the "Property") to the Tenant for the term of ${start_date} to ${end_date}.</p>
         
             <h2>2. MONTHLY RENT:</h2>
             <p>The Tenant agrees to pay a monthly rent of ${monthly_amount} ${currency} for the duration of this Agreement.</p>
         
             <h2>3. PAYMENT TERMS:</h2>
             <p>Rent is due on the [Due Date] of each month. Late payments may incur a [Late Fee] after [Grace Period].</p>
         
             <div class="signature">
               <p>LANDLORD:<br>${owner} <br>Date: ${landlordDate}</p>
               <img src="${landlordSignature}" alt="Landlord's Signature">
               <p>TENANT:<br>${tenant} <br>Date: ${currentDate} </p>
               <img src="${tenantSignature}" alt="Landlord's Signature">
             </div>
         
             
         
             <h2 class="additional-terms">5. ADDITIONAL TERMS:</h2>
             <p class="additional-terms">${agreementtext}</p>
         
             <p>This Agreement is governed by the laws of [Your Jurisdiction]. Any disputes arising under or in connection with this Agreement shall be resolved through arbitration in accordance with the rules of the [Arbitration Institution].</p>
         
            
         
             <div class="signature">
             
          
               <p> <br> <img src="${landlordSignature}" alt="Landlord's Signature"> <br> __________________________<br>${owner}<br>Landlord</p>
               
                  
               <img src="${tenantSignature}" alt="Landlord's Signature">
              
             </div>
           </div>
         </body>
         </html>
         `;
         
         
         
         
         }
         


const browser = await puppeteer.launch({
  args: ['--no-sandbox'],
  headless: 'new',
});
const page = await browser.newPage();

   // Set content of the page to the HTML data
   await page.setContent(agreementData);

   // Generate PDF from the HTML content
   const pdfBuffer = await page.pdf();

     // Close the browser
     await browser.close();

     // Save the PDF to the "agreements" folder in the "public" folder
     const pdfFileName = `${agreementNumber}.pdf`;
     const filePath = path.join('public', 'agreements', pdfFileName);
     fs.writeFileSync(filePath, pdfBuffer);
   

     await con.query('UPDATE tbl_rentagreements SET tenantSignStatus = ? WHERE agreement_number = ?', ['true',agreementNumber]);
        
     await con.commit();
     res.redirect(`/agreements/${agreementNumber}`);
    
      } catch (error) {
        await con.rollback();
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
export {err500  , openAgreement ,addSign , successSingature , fetchprofile , home , openAgreementOwner }


         
