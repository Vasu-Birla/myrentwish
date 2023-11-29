
import { sendTokenCompany } from '../utils/jwtToken.js';
import connection from '../config.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import Excel from 'exceljs'

import {hashPassword, comparePassword, sendMailOTP, sendInvoice, sendOTPFornewPass} from '../middleware/helper.js'
import { ok } from 'assert';

const con = await connection();


var otp;
function setValue()
      {
    otp =   Math.random();
      otp = otp * 1000000;
    return  otp = parseInt(otp);
        
}






//-------------------------- Comapny Home Page -------------------------- 
const comapnyHome = async(req,res,next)=>{ 

  try {
    res.render('index');
  } catch (error) {
    res.render('kilvish500', {'output':'Internal Server Error'});    
  }
}
//------------------- Comapny Login /Profile  start  -----------------------  


const login = async(req,res,next)=>{ 
  console.log("login hited")

  if(!req.company) {
    console.log("Company's Session expired")
    res.render('login',{'output':''}) 
}
else{
    console.log("Company session exists")
    res.redirect('/')
}
}


  const loginCompany = async (req,res,next)=>{  
    const con = await connection();  
  
    const {email,password} = req.body; 
    try {
      if(!email || !password){    
        // res.json("Please Enter Email and Password")
         res.render('login',{'output':'Please Enter Email and Password'})
        
    }
    else 
    {
  
        const [[company]] = await con.query('SELECT * FROM tbl_company WHERE company_email = ?', [email]);     
  
        if(!company){                
           //res.json("Invalid Email & Password")  
          return res.render('login',{'output':'Account does not exists !!'})         
            }

        let isValid = comparePassword( password, company.company_password );        
        if (!isValid) {
                          
             res.render('login',{'output':'Incorrect Password'})   
            }
            else {    
              
              if(company.status == "active") {
                sendTokenCompany(company,200,res)
              } 
            else{ 
                res.render('login',{'output':'You Account Has Been Deactivated .!'})   
            } 
             
          }  
     
   
    }
      
    } catch (error) {
      console.log('Internal Server Error-->',error)
      res.render('login',{'output':'Internal Server Error !!'})
      
    }finally {
      con.release(); 
    }
        
  }



  //---------------- Log Out Section -------------------


  const logout = async (req, res, next) => {
    // Clear the company information from the request object after the user logs out
    req.company = null;
    // res.app.locals.company = null;
  
    res.cookie("Company_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true
    });
  
    res.render('login', { 'output': 'Logged Out !!' });
  }
  



  //--------------- =========================   Company Profile Start ================== ------------------- 

  const profile = async(req,res,next)=>{ 

    try {
      var company = req.company;
      res.render('profile',{'company':company,"output":""})
      
    } catch (error) {
      res.render('kilvish500', {'output':'Internal Server Error'});
      
    }

    }


 
    const ProfilePost= async(req,res,next)=>{         
      const con = await connection(); 
    try {
      await con.beginTransaction(); 

    
      var image =  req.company.image
      var imagePath=  req.company.imagePath 
     if (req.file) {
       image =  req.file.filename ;
       imagePath=  req.file.path ;   
    }
    
    var cDetails = req.body; 
    var companydata = {"company_name":cDetails.company_name,"contact_person":cDetails.contact_person,"company_email":cDetails.company_email,"company_number":cDetails.company_number,"company_address":cDetails.company_address, "image":image ,"imagePath":imagePath};
     await con.query('UPDATE tbl_company SET ? WHERE company_email = ?', [companydata, cDetails.company_email]);
    
    const [[company]] = await con.query('SELECT * FROM tbl_company WHERE company_id = ?', [req.company.company_id]);
    await con.commit(); // Commit the transaction
    res.render('profile',{'company':company,"output":" Profile Updated Successfully !!"})
      
    } catch (error) {
      await con.rollback();
      const [[company]] = await con.query('SELECT * FROM tbl_company WHERE company_id = ?', [req.company.company_id]);
        res.render('profile',{'company':company,"output":"Failed to  Updated Profile !!"})
      
    }finally {
      con.release(); 
    }
        
    }



    
//----------------------- change Password  (hashpass) -------------- 


const changepass = async (req, res, next) => {
  const con = await connection();
  const { opass, npass, cpass } = req.body;

  try {
  
    const existingPass = req.company.company_password;

    let isValid = comparePassword( opass, existingPass );          

    if (!isValid) {    
      return res.render('profile',{"output":"Old password is incorrect"})
    }
    if (npass !== cpass) {
     return res.render('profile',{"output":"New password and confirm password do not match"})
     
    }
      console.log("pahuch gya")
    var password = hashPassword(cpass);
   
    res.render('profile',{"output":"Password changed successfully"})
    await con.query('UPDATE tbl_company SET company_password = ? WHERE company_id = ?', [password, req.company.company_id]);

   
  } catch (error) {
    console.error('Error:', error);
    res.render('profile',{"output":"failed to Update Password "})
  }finally {
    con.release(); 
  }
};




    const updateCompanypic = async(req,res,next)=>{    
      const con = await connection();    
      
      try {
    
        var image =  req.company.image
      var imagePath=  req.company.imagePath 
     if (req.file) {
       image =  req.file.filename ;
       imagePath=  req.file.path ;   
    }
    
        await con.query('UPDATE tbl_company SET image = ?, imagePath = ? WHERE company_id = ?', [image, imagePath, req.company.company_id]);
    
        res.json({msg:"success"})
        
      } catch (error) {
        console.log("failed to update profile pic --> ",error)
        res.json({msg:"failed"})
      }finally {
        con.release(); 
      }
    
     
    }


    //-------------------------  Company Profile Section En  -------------------


    //----------------------- Profile Forgot Password Section Start ------------------------------------- 


    const ForgotPassword = async(req,res,next)=>{  

          
       try {
        res.render('ForgotPassword', { 
          showForgotPasswordForm: true,
          showVerifyOTPPrompt: false,
          showResetPasswordForm: false,
          "output":""
        });
    
        
       } catch (error) {
          res.json("Internal Server Error ")
       }
  
  }


  

  const sendOTP = async (req, res, next) => {
    try {
      const email = req.body.email; // The email provided by the user
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
  
      const con = await connection();
  
      // Check if the user's email already exists in tbl_otp
      const [results] = await con.query('SELECT * FROM tbl_otp WHERE email = ?', [email]);
  
      if (results.length === 0) {
        // Insert a new record in tbl_otp
        const currentTime = new Date();
        const expiryTime = new Date(currentTime.getTime() + 10 * 60000); // Expiry time is set to 10 minutes from the current time
        await con.query('INSERT INTO tbl_otp (email, otp_code, expire_at) VALUES (?, ?, ?)', [email, otp, expiryTime]);
      } else {
        // Update the existing record in tbl_otp
        const currentTime = new Date();
        const expiryTime = new Date(currentTime.getTime() + 10 * 60000); // Expiry time is set to 10 minutes from the current time
        await con.query('UPDATE tbl_otp SET otp_code = ?, expire_at = ? WHERE email = ?', [otp, expiryTime, email]);
      }
  
      // Call the function to send the OTP through the appropriate channel (e.g., email, SMS)
      await sendOTPFornewPass(email, otp);
  
      res.render('ForgotPassword', {
        showForgotPasswordForm: false,
        showVerifyOTPPrompt: true,
        showResetPasswordForm: false,
        output: 'OTP sent !!',
        email: email
      });
    } catch (error) {
      console.log(error);
      res.render('ForgotPassword', {
        showForgotPasswordForm: true,
        showVerifyOTPPrompt: false,
        showResetPasswordForm: false,
        output: 'Failed to send OTP. Internal server error.'
      });
    }
  };
  


const verifyOTP = async (req, res, next) => {

  const con = await connection();
  const userOTP = req.body.otp;
  const email = req.body.verifyEmail; 
  try {

    const [results] = await con.query('SELECT * FROM tbl_otp WHERE email = ?', [email]);
    const storedOTP = results[0].otp_code;
    const expiryTime = new Date(results[0].expire_at);

    console.log('storedOTP',storedOTP)
    
    console.log('userOTP',userOTP)

    // Verify the OTP
    if (userOTP == storedOTP && new Date() < expiryTime) {  console.log("correct OTP")
      res.render('ForgotPassword', {
        showForgotPasswordForm: false,
        showVerifyOTPPrompt: false,
        showResetPasswordForm: true,
        output: '',
        email: email
      });
    } else { console.log(" Incorrect OTP")
      res.render('ForgotPassword', {  
        showForgotPasswordForm: false,
        showVerifyOTPPrompt: true,
        showResetPasswordForm: false,
        output: 'Invalid or expired OTP. Please try again',
        email: email
      });
    }
  } catch (error) {
    console.error(error);
    res.json('Error in verifying OTP');
  }
};




const resetpassword = async(req,res,next)=>{ 
  const con = await connection();  
   
  const { resetemail, npass, cpass } = req.body;

  
try {
  if (npass !== cpass) {


   return res.render('ForgotPassword', {
      showForgotPasswordForm: false,
      showVerifyOTPPrompt: false,
      showResetPasswordForm: true,
      "output":"New password and confirm password do not match",
      "email":resetemail
    });    
   }


  var newPassword  = hashPassword(cpass);
  await con.query('UPDATE tbl_company SET company_password = ? WHERE company_email = ?', [newPassword, resetemail ])

  res.render('login',{'output':'Password Reset Success !'})
  
} catch (error) {

  res.render('ForgotPassword', { 
    showForgotPasswordForm: true,
    showVerifyOTPPrompt: false,
    showResetPasswordForm: false,
    "output":"Failed to Reset Password , Please Try Again "
  });
  
}
      
 
}

  
 //------------------------------- Forgot Password End ---------------------------- 




  
const err500 = async(req,res,next)=>{

  res.render('kilvish500', {'output':'Internal Server Error'});


  }


    


  //--------------------- Export Start ------------------------------------------
export {comapnyHome, login,logout, loginCompany,
    changepass, profile, ProfilePost,err500 , updateCompanypic , 
     ForgotPassword , sendOTP , verifyOTP , resetpassword
  }


         
