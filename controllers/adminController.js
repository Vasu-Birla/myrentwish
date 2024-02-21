
import { sendTokenAdmin, sendTokenUser } from '../utils/jwtToken.js';
import connection from '../config.js';

const con = await connection();
import * as path from 'path';

import upload from '../middleware/upload.js';


import {hashPassword, comparePassword, sendWelcomeMsg , responsetoQuery , sendOTPFornewPass ,sendNotification} from '../middleware/helper.js'
import { response } from 'express';

//-------------------- Home page  ------------------------------ 


const homePage = async(req,res,next)=>{ 

  const con = await connection();

  try {
    await con.beginTransaction();

    var clientIp = req.clientIp;
      // Remove the IPv6 prefix if present
            if (clientIp && clientIp.substring(0, 7) === '::ffff:') {
              clientIp = clientIp.substring(7);        
                }

                
    const timestamp = new Date().toString();
    var LastLogin = `Last login: ${timestamp} from ${clientIp}`;
    console.log(LastLogin);
   


      await con.query('INSERT INTO tbl_visitors (ip_address) VALUES (?)', [clientIp]);

    

    var [[users]] = await con.query('SELECT COUNT(*) AS count FROM tbl_users');
    var [[props]] = await con.query('SELECT COUNT(*) AS count FROM tbl_prop');
    var [[rentedPropsResult]] = await con.query('SELECT COUNT(*) AS count FROM tbl_prop WHERE prop_status = "rented"');



    var [interestCounts] = await con.query('SELECT prop_id, COUNT(*) AS count FROM tbl_interest GROUP BY prop_id ORDER BY count DESC LIMIT 8');



    // Prepare an array to store the dataPoints
var dataPoints = [];
for (let i = 0; i < 8; i++) {
  const interestCount = interestCounts[i] || { prop_id: null, count: 0 };

  const { prop_id, count } = interestCount;
  var [propertyResult] = await con.query('SELECT * FROM tbl_prop WHERE prop_id = ?', [prop_id]);
  const propertyName = propertyResult.length > 0 ? propertyResult[0].title : "Unknown Property";
  const OwnerName = propertyResult.length > 0 ? propertyResult[0].owner_name : "Unknown Owner";

  dataPoints.push({ y: count, label: propertyName , Owner:OwnerName});
}

    var Data = {
      usernum: users.count,
      propsnum: props.count,
      rentedPropsCount: rentedPropsResult.count,
      dataPoints:dataPoints,
      clientIp : clientIp
    };
    

    con.commit()
    res.render('admin/index',{Data}) 

  } catch (error) {
    con.rollback()
    console.log(error.message)
    res.render('admin/kilvish500', {'output':'Internal Server Error'});
    
  }

}


//--------------------  Login/ logout Start -------------------------------


const loginPage = async(req,res,next)=>{    
      if(!req.admin) {
        console.log("Admin's Session expired")
        res.render('admin/login',{'output':''}) 
    }
    else{
        console.log("Admin session exists")
        res.redirect('/admin')
    }
    //res.render('admin/login',{'output':''}) 
}


const loginAdmin = async (req,res,next)=>{     

  console.log(req.body)
  const con = await connection();  

  const {username,password} = req.body; 
  //if user don't enter email password
  if(!username || !password){    
      // res.json("Please Enter Email and Password")
       res.render('admin/login',{'output':'Please Enter Username and Password'})
      
  }
  else 
  {

      const [results] = await con.query('SELECT * FROM tbl_admin WHERE username = ?', [username]);                 
      const admin = results[0];    

       if(!admin){                
         //res.json("Invalid Email & Password")  
        res.render('admin/login',{'output':'Invalid Username'})         
          }
           else if (admin.password != password) {
                        
           res.render('admin/login',{'output':'Incorrect Password'})   
          }
          else {             
           sendTokenAdmin(admin,200,res)
           }  
   
 
  }    
}


const logout = async(req,res,next)=>{    

  res.cookie("Admin_token",null,{
    expires : new Date(Date.now()),
    httpOnly:true
})

res.render('admin/login',{'output':'Logged Out !!'}) 
}


//-----------------------  check Pass  --------------------- 

const checkPass = async (req, res, next) => {
  const con = await connection();


  try {
    const { username, password } = req.body;

    const [rows] = await con.query('SELECT * FROM tbl_admin WHERE username = ?', [username]); 
    

    if (rows.length > 0) {

      // let isValid = comparePassword( password, rows[0].password );
      if (password != rows[0].password ) {
      
        res.json({ msg: false});         
       
      }else{

        res.json({ msg: true});
      }    
    }else{
      res.json({ msg: 'Noadmin'});
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }finally {
    con.release(); 
  }
};





    //----------------------- Profile Forgot Password Section Start ------------------------------------- 


    const ForgotPassword = async(req,res,next)=>{  

          
      try {
       res.render('ForgotPassword', { 
         showForgotPasswordForm: true,
         showVerifyOTPPrompt: false,
         showResetPasswordForm: false,
         "output":"Enter Your Email"
       });
   
       
      } catch (error) {
         res.json("Internal Server Error ")
      }
 
 }


 

 const sendOTP = async (req, res, next) => {
  const con = await connection();
  const email = req.body.email; 
   try {
     
     await con.beginTransaction();

    var [isUser] =  await con.query('SELECT * FROM tbl_admin WHERE email = ?', [email]);

   if(isUser.length == 0){
  return  res.render('ForgotPassword', {
      showForgotPasswordForm: true,
      showVerifyOTPPrompt: false,
      showResetPasswordForm: false,
      output: 'Invalid Email.'
    });
   }


     const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP

 
 
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
 
     await con.commit();
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
     await con.rollback();
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


 await con.query('UPDATE tbl_admin SET password = ? WHERE email = ?', [cpass, resetemail ])

 res.render('login',{'output':'Password Reset Success !'})
 
} catch (error) {
  console.log(error)

 res.render('ForgotPassword', { 
   showForgotPasswordForm: true,
   showVerifyOTPPrompt: false,
   showResetPasswordForm: false,
   "output":"Failed to Reset Password , Please Try Again "
 });
 
}
     

}

 
//------------------------------- Forgot Password End ---------------------------- 



//---------------------- Admin Profile  view/edit ----------------------


const Profile= async(req,res,next)=>{    

  try {
    var admin = req.admin;
    res.render('admin/profile',{'admin':admin,"output":""})
    
  } catch (error) {
    res.render('admin/kilvish500', {'output':'Internal Server Error'});
  }
    
 
}


const ProfilePost= async(req,res,next)=>{    console.log(req.file)
  
  const con = await connection(); 
try {

  var image =  req.admin.image
  var imagePath=  req.admin.imagePath 
 if (req.file) {
   image =  req.file.filename ;
   imagePath=  req.file.path ;   
}

console.log(image)
var uDetails = req.body; 
var userdata = {"firstname":uDetails.firstname,"lastname":uDetails.lastname,"email":uDetails.email,"username":uDetails.username,"contact":uDetails.contact, "image":image ,"imagePath":imagePath , "address":req.body.address};
 await con.query('UPDATE tbl_admin SET ? WHERE id = ?', [userdata, req.admin.id]);

const [[admin]] = await con.query('SELECT * FROM tbl_admin WHERE id = ?', [req.admin.id]);

console.log(admin)
res.render('admin/profile',{'admin':admin,"output":" Profile Updated Successfully !!"})
  
} catch (error) {
  const [[admin]] = await con.query('SELECT * FROM tbl_admin WHERE id = ?', [req.admin.id]);

  res.render('admin/profile',{'admin':admin,"output":"Failed to  Updated Profile !!"})
  
}finally {
  con.release(); 
}
    
}






const updateadminpic = async(req,res,next)=>{ 
  const con = await connection();  
 
  
  try {
    await con.beginTransaction();





    var image =  req.admin.image
  var imagePath=  req.admin.imagePath 
 if (req.file) {
   image =  req.file.filename ;
   imagePath=  req.file.path ;   
}
 await con.query('UPDATE tbl_admin SET image = ?, imagePath = ? WHERE id = ?', [image, imagePath, req.admin.id]);
 await con.commit();
    res.json({msg:"success"})    
  } catch (error) {
    await con.rollback();
    console.log("failed to update profile pic --> ",error)
    res.json({msg:"failed"})
  }finally {
    con.release(); 
  }

 
}


//----------------------- change Pass word -------------- 



const changepass = async (req, res, next) => {
  const con = await connection();

  try {
  
    const existingPass = req.admin.password;
  
    const { opass, npass, cpass } = req.body;

    if (opass !== existingPass) {    
      return res.render('admin/profile',{"output":"Old password is incorrect"})
    }
    if (npass !== cpass) {
     return res.render('admin/profile',{"output":"New password and confirm password do not match"})
     
    }
   
    res.render('admin/profile',{"output":"Password changed successfully"})
    await con.query('UPDATE tbl_admin SET password = ? WHERE id = ?', [cpass,req.admin.id]);

   
  } catch (error) {
    console.error('Error:', error);
    res.render('admin/profile',{"output":"failed to Update Password "})
  }finally {
    con.release(); 
  }
};





//================================== User Section ===============================================


//------------- add User --------------------  

const addUser = async(req,res,next)=>{    

  try {

    res.render('admin/addUser')

  } catch (error) {
    res.render('admin/kilvish500')
  }
    
 
}



const viewUsers = async(req,res,next)=>{    

  
  const con = await connection();
  try {   

    var [users] =  await con.query('SELECT * FROM tbl_users ORDER BY created_at DESC');
    
    
    res.render('admin/viewUsers', {'users':users,'output':'Your users Fetched'});

  } catch (error) {
    console.error('Error retrieving Companies:', error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});
  }finally {
    con.release(); 
  }
  
 
}



const viewUser = async(req,res,next)=>{ 

  const con = await connection();
  try{
   
    var userID = req.query.userID; 
    var [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID ]);       
  
    res.render('admin/viewUser',{'user':user,"output":"fetched "+user.firstname+"'s Details"})
  
  }catch(error){
    res.render('kilvish500', {'output':'Internal Server Error'});
  }finally {
    con.release(); 
  }
}







const updateUserStatus = async(req,res,next)=>{ 


  const con = await connection(); 
  try {

    await con.beginTransaction();



    
    const { userID, status } = req.body;
    const [result] = await con.query('UPDATE tbl_users SET status = ? WHERE user_id = ?', [status, userID]);


    var [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID ]);  
    
    
await con.commit();
    res.status(200).json({ kilvish:'active',message: `User ${user.status === 'active' ? 'Activated' : 'Deactivated'}`});
  } catch (error) {
    await con.rollback();
    console.error("Database error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }finally {
    con.release(); 
  }
  


}



const viewUserPost = async(req,res,next)=>{ 

  const con = await connection(); 
  const { user_id, firstname, lastname,user_email,user_mobile, address, gender } = req.body;
  try{      
    await con.beginTransaction();

   
    
  
  var userdata = {"firstname":firstname,"lastname":lastname,"user_email":user_email,"user_mobile":user_mobile, "address":address, "gender":gender};

  const [result] = await con.query('UPDATE tbl_users SET ? WHERE user_id = ?', [userdata, user_id]);


  var [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [user_id ]);   

  var [users] =  await con.query('SELECT * FROM tbl_users');
    
 

  await con.commit();
  //res.render('admin/viewUser',{'user':user,"output":"Updated "+user.firstname+"'s Details"})

  res.redirect('/admin/viewUsers')
  //res.render('admin/viewUsers',{'users':users,"output":"Updated "+user.firstname+"'s Details"})

  }catch(error){
    await con.rollback();
    var [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [user_id ]);   
    
    console.log("Failed to Update ->> ",error)
    res.render('admin/viewUser',{'user':user,"output":"Failed to Update"})

  }finally {
    con.release(); 
  }


}




//--------- Delete user 

const  deleteUser = async(req,res,next)=>{ 

  const con = await connection();
  const userID = req.query.userID; 

  try {  

    await con.beginTransaction();

    await con.query('DELETE FROM tbl_users WHERE user_id = ?', [userID]);
    var [users] =  await con.query('SELECT * FROM tbl_users ORDER BY created_at DESC');

    await con.commit();
    res.render('admin/viewUsers', {'users':users,'output':'User Deleted'});
    
  } catch (error) {
    await con.rollback();
    var [users] =  await con.query('SELECT * FROM tbl_users');
    res.render('admin/viewUsers', {'users':users,'output':'Failed to Delete'});
    
  }finally{

    con.release();
  }
  }





  

const  deleteUser1 = async(req,res,next)=>{ 

    console.log("ddelete added ")

  const con = await connection();
  const userID = req.body.userID; 

  try {  
    await con.beginTransaction();

     // Delete user's properties from tbl_prop
     await con.query('DELETE FROM tbl_prop WHERE user_id = ?', [userID]);

    await con.query('DELETE FROM tbl_users WHERE user_id = ?', [userID]);
    var [users] =  await con.query('SELECT * FROM tbl_users');


    await con.commit();
    res.status(200).json({ msg:true });

    //res.render('admin/viewUsers', {'users':users,'output':'User Deleted'});
    
  } catch (error) {

    await con.rollback();
    var [users] =  await con.query('SELECT * FROM tbl_users');
    res.status(200).json({ msg:false });
  //  res.render('admin/viewUsers', {'users':users,'output':'Failed to Delete'});
    
  }finally{

    con.release();
  }
  }










//===================================== Property Section ===========================


//------- add/view prop type ---------------

const propType = async(req,res,next)=>{    

  const con = await connection();

  try {

    const [proptypes] = await con.query('SELECT * FROM tbl_proptype ORDER BY created_at DESC');
    res.render('admin/propType', { 'proptypes': proptypes, 'output': 'Property Types Fetched!!' });
  } catch (error) {
    res.render('admin/kilvish500')
  }finally{
    con.release();
  }
    
 
}




const propTypePost = async (req, res, next) => {
  const con = await connection();

  try {
    const { prop_type } = req.body;

    // Check if the prop_type already exists
    const [existingPropType] = await con.query('SELECT * FROM tbl_proptype WHERE prop_type = ?', [prop_type]);

    if (existingPropType.length > 0) {
      // Return an error if the prop_type already exists
      const [proptypes] = await con.query('SELECT * FROM tbl_proptype');
      return res.render('admin/propType', { 'proptypes': proptypes, 'output': 'Error: Duplicate Property Type' });
    }
      

    await con.beginTransaction();

    // Insert the prop_type value into tbl_proptype
    await con.query('INSERT INTO tbl_proptype (prop_type) VALUES (?)', [prop_type]);

    // Retrieve updated proptypes after insertion
    const [proptypes] = await con.query('SELECT * FROM tbl_proptype');

    await con.commit();
    res.render('admin/propType', { 'proptypes': proptypes, 'output': 'Property Type Added' });
  } catch (error) {
    await con.rollback();
    console.error('Error in propTypePost API:', error);
    res.render('admin/kilvish500');
  } finally {
    con.release();
  }
};


const updatepropType = async (req, res, next) => { 

  const con = await connection(); 
  try {

    await con.beginTransaction();    
    const { proptypeID, propType } = req.body;
    const [result] = await con.query('UPDATE tbl_proptype SET prop_type = ? WHERE id = ?', [propType, proptypeID]);
       
    await con.commit();
    res.status(200).json({ msg:true});
  } catch (error) {
    await con.rollback();
    console.error("Database error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }finally {
    con.release(); 
  }
  

}





const  deletepropType = async(req,res,next)=>{ 

  

  console.log("ddelete added ")

const con = await connection();
const propTypeID = req.body.propTypeID; 

try {  
  await con.beginTransaction();

  await con.query('DELETE FROM tbl_proptype WHERE id = ?', [propTypeID]);

  await con.commit();
  res.status(200).json({ msg:true });
  
} catch (error) {

  await con.rollback();
  res.status(200).json({ msg:false });

  
}finally{

  con.release();
}
}




//------------- view all properties -------

const properties = async(req,res,next)=>{    
    
  const con = await connection();
  try {   

    var [props] =  await con.query('SELECT * FROM tbl_prop ORDER BY created_at DESC');
    
    res.render('admin/properties', {'props':props,'output':'Your properties Fetched'});

  } catch (error) {
    console.error('Error retrieving Companies:', error);
    res.render('admin/kilvish500', {'output':'Internal Server Error'});
  }finally {
    con.release(); 
  }
 



}




// Delete Property -------- 


const deleteProperty = async (req, res, next) => {
  const con = await connection();
  try {
    await con.beginTransaction();

    const propertyID = req.body.prop_id;

    // Delete the property from the tbl_prop table
    const deleteSql = 'DELETE FROM tbl_prop WHERE prop_id = ?';
    const [result] = await con.query(deleteSql, [propertyID]);

    await con.commit();
    console.log("Property Deleted Successfully ")
    res.json({ result: "success", msg: true });

  } catch (error) {
    // Rollback the transaction in case of an error
    await con.rollback();
    console.error('Error in delete Property API:', error);
    res.status(500).json({ result: 'Internal Server Error' });

  } finally {
    if (con) {
      con.release();
    }
  }
};



//----------------- update propety status ----------




const updatePropertyStatus = async (req, res, next) => {
  const con = await connection();
  try {
    await con.beginTransaction();

    const { prop_id, status } = req.body;

    // Update status and is_available based on the new status
    const newStatus = status === 'rented' ? 'rented' : 'available';
    // const isAvailable = status !== 'rented';
    const isAvailable = status !== 'rented' ? 'true' : 'false';

    const [result] = await con.query(
      'UPDATE tbl_prop SET prop_status = ?, is_available = ? WHERE prop_id = ?',
      [newStatus, isAvailable, prop_id]
    );

    await con.commit();
    res.status(200).json({ msg: true, message: 'Status and is_available updated' });
  } catch (error) {
    await con.rollback();
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    con.release();
  }
};





//--Notify user ------------- 

const notification = async(req,res,next)=>{   
  
  const con = await connection(); 
  try {
    const [users] = await con.query('SELECT * FROM tbl_users ORDER BY created_at DESC');
    res.render('admin/notification',{'output':'','users':users}) 
  } catch (error) {
    console.log(error)
    res.render('admin/kilvish500')
  } finally{
    con.release()
  }
    
 
}


const NotifyPost = async (req, res, next) => {  

  console.log("in API ->> ",req.body.recipientEmail)
  const con = await connection();

  try {
    const recipientEmails = Array.isArray(req.body.options) ? req.body.options : [req.body.options];

    const subject = req.body.emailSubject;
    const message = req.body.emailMessage;

    await con.beginTransaction();

    const isSent = await sendNotification(recipientEmails, message, subject);
    const [users] = await con.query('SELECT * FROM tbl_users ORDER BY created_at DESC');

    await con.commit();
    res.render('admin/notification',{'output':'','users':users}) 

    // if (isSent) {
    //   await con.commit();
    //   res.render('admin/notification', {
    //     "output": "Email Sent to " + recipientEmails.join(", ") + " Successfully",
    //     "users": users
    //   });
    // } else {
    //   await con.rollback();
    //   res.render('admin/notification', {
    //     "output": "Failed to send Email",
    //   });
    // }
  } catch (error) {
    console.error('Error in NotifyPost API:', error);
    await con.rollback();
    res.status(500).send('Internal Server Error');
  } finally {
   
      con.release();
  
  }
};



//====================================== Question Section  ======================


const addQuestion = async(req,res,next)=>{    

  try {
    res.render('admin/addQuestion') 
  } catch (error) {
    res.render('admin/kilvish500')
  }
    
 
}






const addQuestionPost = async (req, res, next) => { 
  const con = await connection();

  try {
    await con.beginTransaction();

    const { question_text, question_type, answerOptions } = req.body;

    console.log("answer_options -> ",answerOptions)
    

    if (!['options_2', 'options_3', 'dropdown','Text'].includes(question_type)) {
      await con.rollback();
      return res.status(500).json({ result: "Invalid question type" });
    }



    console.log(question_type)
    // Insert the question into the tbl_questions table
    const insertSql = 'INSERT INTO tbl_questions (question_text, question_type, answer_options) VALUES (?, ?, ?)';
    const insertValues = [question_text, question_type, JSON.stringify(answerOptions)];
    const [results] = await con.query(insertSql, insertValues);

    await con.commit();
    res.json({ result: "success", question_id: results.insertId });

  } catch (error) {
    // Rollback the transaction in case of an error
    await con.rollback();
    console.error('Error in addQuestions API:', error);
    res.status(500).json({ result: 'Internal Server Error' });

  } finally {
    if (con) {
      con.release();
    }
  }
};



const viewQuestions = async (req, res, next) => {
  const con = await connection();

  try {
    // Fetch questions from the tbl_questions table
    const [questions] = await con.query('SELECT * FROM tbl_questions ORDER BY question_id DESC');
    
    // Render the viewQuestions page and pass the questions data to the template
    res.render('admin/viewQuestions', { questions });
  } catch (error) {
    console.error('Error in viewQuestions API:', error);
    // Render an error page if there's an issue
    res.render('admin/kilvish500');
  } finally {
    if (con) {
      con.release();
    }
  }
};



const viewQuestion = async(req,res,next)=>{ 

  const con = await connection();
  try{
   
    var quesID = req.query.quesID; 
    var [[question]] = await con.query('SELECT * FROM tbl_questions WHERE question_id = ?', [quesID ]);   
  
    res.render('admin/viewQuestion',{'question':question,"output":"fetched "+question.question_id+"'s Details"})
  
  }catch(error){
    res.render('admin/kilvish500', {'output':'Internal Server Error'});
  }finally {
    con.release(); 
  }
}

const viewQuestionPost = async (req, res, next) => {  
  const con = await connection();

  try {
    await con.beginTransaction();

    const { question_id, question_text, question_type, answerOptions } = req.body;

    // Validate if the question exists
    const [[existingQuestion]] = await con.query('SELECT * FROM tbl_questions WHERE question_id = ?', [question_id]);

    if (!existingQuestion) {
      await con.rollback();
      return res.json({ result: "Question not found" });
    }

    if (!['options_2', 'options_3', 'dropdown'].includes(question_type)) {
      await con.rollback();
      return res.json({ result: "Invalid question type" });
    }

    // Update the question details in the tbl_questions table
    const updateSql = 'UPDATE tbl_questions SET question_text = ?, question_type = ?, answer_options = ? WHERE question_id = ?';
    const updateValues = [question_text, question_type, JSON.stringify(answerOptions), question_id];
    await con.query(updateSql, updateValues);

    await con.commit();
    res.json({ result: "success" });

  } catch (error) {
    // Rollback the transaction in case of an error
    await con.rollback();
    console.error('Error in viewQuestionPost API:', error);
    res.status(500).json({ result: 'Internal Server Error' });

  } finally {
    if (con) {
      con.release();
    }
  }
};


//--------- delete Question ----------- 


const  deletepQues = async(req,res,next)=>{ 

const con = await connection();
const question_id = req.body.question_id; 

try {  
  await con.beginTransaction();

  await con.query('DELETE FROM tbl_questions WHERE question_id = ?', [question_id]);

  await con.commit();
  res.status(200).json({ msg:true });
  
} catch (error) {

  await con.rollback();
  res.status(200).json({ msg:false });

  
}finally{

  con.release();
}
}








//====================== Skills Section ======================================================




const skills = async(req,res,next)=>{    

  const con = await connection();

  try {

    const [skills] = await con.query('SELECT * FROM tbl_skills ORDER BY created_at DESC');
    res.render('admin/skills', { 'skills': skills, 'output': 'skills Fetched!!' });
  } catch (error) {
    res.render('admin/kilvish500')
  }finally{
    con.release();
  }
    
 
}


const skillsPost = async (req, res, next) => {
  const con = await connection();

  try {
    const { skill } = req.body;

    // Check if the prop_type already exists
    const [existingSkill] = await con.query('SELECT * FROM tbl_skills WHERE skill = ?', [skill]);

    if (existingSkill.length > 0) {
      // Return an error if the prop_type already exists
      const [skills] = await con.query('SELECT * FROM tbl_skills');
      return res.render('admin/skills', { 'skills': skills, 'output': 'Error: Can not add Duplicate Skill' });
    }
      

    await con.beginTransaction();

    // Insert the prop_type value into tbl_proptype
    await con.query('INSERT INTO tbl_skills (skill) VALUES (?)', [skill]);

    // Retrieve updated proptypes after insertion
    const [skills] = await con.query('SELECT * FROM tbl_skills');

    await con.commit();
    res.render('admin/skills', { 'skills': skills, 'output': 'Skill Added' });
  } catch (error) {
    await con.rollback();
    console.error('Error in propTypePost API:', error);
    res.render('admin/kilvish500');
  } finally {
    con.release();
  }
};

const addSkills = async(req,res,next)=>{    

  try {
    res.render('admin/addSkills') 
  } catch (error) {
    res.render('admin/kilvish500')
  }
    
 
}


const viewSkills = async(req,res,next)=>{    

  try {
    res.render('admin/viewSkills') 
  } catch (error) {
    res.render('admin/kilvish500')
  }
    
 
}




const  deleteSkill = async(req,res,next)=>{ 

  

const con = await connection();
const skillID = req.body.skillID; 

try {  
  await con.beginTransaction();

  await con.query('DELETE FROM tbl_skills WHERE id = ?', [skillID]);

  await con.commit();
  res.status(200).json({ msg:true });
  
} catch (error) {

  await con.rollback();
  res.status(200).json({ msg:false });

  
}finally{

  con.release();
}
}





const Deleteskill = async(req,res,next)=>{    

  const con = await connection();

  try {

    const [skills] = await con.query('SELECT * FROM tbl_skills ORDER BY created_at DESC');
    res.render('admin/skills', { 'skills': skills, 'output': 'Skill Deleted' });
  } catch (error) {
    res.render('admin/kilvish500')
  }finally{
    con.release();
  }
    
 
}








//==========================   Privacy Section Start ===========================================


  
const userPrivacy = async(req,res,next)=>{ 

  const con = await connection(); 

  try {      
  const [pandps] = await con.query('SELECT * FROM tbl_pandp ORDER BY id DESC');
  res.render('admin/userPrivacy',{'output':'User Privacy Feched ..!','pandps':pandps})
  } catch (error) {
    res.render('admin/kilvish500',{'output':'Failed to Fetch Privacy','pandps':'pandps'})
  }
  }




  const userPrivacyPost = async(req,res,next)=>{ 
    
    const con = await connection();
    try {
      
  
      const policyContent = decodeURIComponent(req.body.pandp);

      //const tandcID = decodeURIComponent(req.body.tandcID);   //  For multiple TandC if required in Future 
  
      const [result] = await con.query('SELECT * FROM tbl_pandp where id = ?', [1]);
  
      if (result.length > 0) {
        const [results] = await con.query('UPDATE tbl_pandp SET policy = ? WHERE id = ?', [policyContent, 1]);
  
        const [pandps] = await con.query('SELECT * FROM tbl_pandp');
  
        if (results) {
          res.render('userPrivacy', { output: 'Customer Privacy Updated Successfully !!', pandps: pandps });
        } else {
          res.render('userPrivacy', { output: 'Failed to update Customer Privacy', pandps: pandps });
        }
      } else {
        await con.query('ALTER TABLE `tbl_pandp` AUTO_INCREMENT = 1');
        const sql = 'INSERT INTO `tbl_pandp` ( policy ) VALUES (?)';
        const values = [policyContent];
        const [results] = await con.query(sql, values);
     
        const [pandps] = await con.query('SELECT * FROM tbl_pandp');
  
  
        if (results) {
          res.render('userPrivacy', { output: 'Customer Privacy  Added Successfully !!', pandps: pandps });
        } else {
          res.render('userPrivacy', { output: 'Failed to add Customer Privacy', pandps: pandps });
        }
      }
    } catch (error) {
      console.error('Error:', error);

      res.status(500).send('Internal Server Error', error);
    }
    }




    const deleteuserPrivacy = async(req,res,next)=>{ 


      const con = await connection();
      const pandpID = req.query.pandpID; 
      try {  
    
        await con.query('DELETE FROM tbl_pandpy WHERE id = ?', [pandpID]);
        const [pandps] = await con.query('SELECT * FROM tbl_pandp ORDER BY id DESC');
    
        res.render('userPrivacy', {'pandps':pandps,'output':'User Privacy Deleted'});
        
      } catch (error) {
    
        const [pandps] = await con.query('SELECT * FROM tbl_pandp');
        res.render('userPrivacy', {'pandps':pandps,'output':'Failed to Delete User Privacy'});
        
      }finally{
    
        con.release();
      }
    
    
      }









//==================================== Terms & Condition Section Start -------------------------------





const tandc = async(req,res,next)=>{   
  const con = await connection(); 
 
      try {
        const [tandcs] = await con.query('SELECT * FROM tbl_tandc');   
        res.render('admin/tandc',{'output':'T & C Fetched','tandcs':tandcs})
      } catch (error) {
        res.render('admin/kilvish500')
      }
 
  }


  




  const tandcPost = async (req, res, next) => {
    const con = await connection();
  
    try {
      await con.beginTransaction();
  
      const termsContent = decodeURIComponent(req.body.tandc);
  
      //const tandcID = decodeURIComponent(req.body.tandcID);   //  For multiple TandC if required in Future 
  
      const [result] = await con.query('SELECT * FROM tbl_tandc where id = ?', [1]);
  
      if (result.length > 0) {
        const [results] = await con.query('UPDATE tbl_tandc SET terms = ? WHERE id = ?', [termsContent, 1]);
  
        const [tandcs] = await con.query('SELECT * FROM tbl_tandc');
  
        if (results) {
          await con.commit();
          res.render('admin/tandc', { output: 'Terms&Condition Updated Successfully !!', tandcs: tandcs });
        } else {
          await con.rollback();
          res.render('admin/tandc', { output: 'Failed to update Terms&Condition', tandcs: tandcs });
        }
      } else {
        await con.query('ALTER TABLE `tbl_tandc` AUTO_INCREMENT = 1');
        const sql = 'INSERT INTO `tbl_tandc` ( terms ) VALUES (?)';
        const values = [termsContent];
        const [results] = await con.query(sql, values);
        const [tandcs] = await con.query('SELECT * FROM tbl_tandc');
  
        if (results) {
          await con.commit();
          res.render('admin/tandc', { output: 'Terms&Condition Added Successfully !!', tandcs: tandcs });
        } else {
          await con.rollback();
          res.render('admin/tandc', { output: 'Failed to add Terms&Condition ', tandcs: tandcs });
        }
      }
    } catch (error) {
      await con.rollback();
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      con.release();
    }
  };

  



  
  const  deletetandc= async (req, res)=>{
    
    const con = await connection();
    const tandcID = req.query.tandcID; 
    try {  
  
      await con.query('DELETE FROM tbl_tandc WHERE id = ?', [tandcID]);
      const [tandcs] = await con.query('SELECT * FROM tbl_tandc');
  
      res.render('tandc', {'tandcs':tandcs,'output':'T&C Deleted'});
      
    } catch (error) {
  
    const [tandcs] = await con.query('SELECT * FROM tbl_tandc');
  
      res.render('tandc', {'tandcs':tandcs,'output':'Failed to Delete'});
      
    }finally{
  
      con.release();
    }
  
  
     
    }
  
  




  //====================  Faq Section ===================================== 

  
const faq = async(req,res,next)=>{ 
  const con = await connection(); 
      try {
            const [faqs] = await con.query('SELECT * FROM tbl_faq ORDER BY created_at DESC'); 

            console.log(faqs.length )

            if(faqs.length > 0){
              
              res.render('admin/faq',{'output':'ALL FAQs Fetched','faqs':faqs})
            }else{
              res.render('admin/faq',{'output':'No FAQ found','faqs':faqs})
            }
       
      } catch (error) {
        res.render('admin/kilvish500')
      }
  }





const addFAQ = async (req, res, next) => {
  const con = await connection();

  try {
    await con.beginTransaction();

    // Extracting data from the request body
    const { faq, answer } = req.body;

    // Insert the new FAQ into the tbl_faqs table
    await con.query('INSERT INTO tbl_faq (faq, answer) VALUES (?, ?)', [faq, answer]);

    // Retrieve updated FAQs after insertion
    const [faqs] = await con.query('SELECT * FROM tbl_faq ORDER BY created_at DESC');

    await con.commit();
    res.render('admin/faq', { 'faqs': faqs, 'output': 'FAQ Added Successfully' });
  } catch (error) {
    await con.rollback();
    console.error('Error in addFAQ API:', error);
    res.render('admin/kilvish500');
  } finally {
    con.release();
  }
};

const deleteFAQ = async(req,res,next)=>{

  const con = await connection();
  const faqID = req.query.faqID; 

  try {
    await con.beginTransaction();
   
    await con.query('DELETE FROM tbl_faq WHERE faq_id = ?', [faqID]);

    const [faqs] = await con.query('SELECT * FROM tbl_faq ORDER BY created_at DESC');
    await con.commit();
    res.render('faq', {'faqs':faqs,'output':'FAQ Deleted'});
    
  } catch (error) {

    await con.rollback();
    console.log(error)
    const [faqs] = await con.query('SELECT * FROM tbl_faq'); 
    res.render('faq', {'faqs':faqs,'output':'Failed to Delete'});
    
  }


  }

  const editFAQ = async (req, res, next) => {
    const con = await connection();
  
    try {
      await con.beginTransaction();
  
      const { faq_id, faq, answer } = req.body;
  
      // Check if the FAQ with given ID exists
      const [[existingFAQ]] = await con.query('SELECT * FROM tbl_faq WHERE faq_id = ?', [faq_id]);
      if (!existingFAQ) {
        await con.rollback();
        return res.json({ result: 'failed', message: 'FAQ not found' });
      }
  
      // Update the FAQ
      await con.query('UPDATE tbl_faq SET faq = ?, answer = ? WHERE faq_id = ?', [faq, answer, faq_id]);
  
      await con.commit();
      res.json({ result: 'success', message: 'FAQ updated successfully', faq_id:faq_id , faq:faq, answer:answer });
    } catch (error) {
      await con.rollback();
      console.error('Error in editFAQ API:', error);
      res.status(500).json({ result: 'failed', message: 'Internal Server Error' });
    } finally {
      con.release();
    }
  };
  
  

  
//--------------------------- FAQ  End -------------------------- 




  //============================== Help & inqueriy  =======================



  const addInquiryDetails = async(req,res,next)=>{ 

    const con = await connection();   

    try {
      const [[support]] = await con.query('SELECT * FROM tbl_support');
      res.render('admin/addInquiryDetails',{'output':'Support Details fetched','support':support});
    } catch (error) {
      res.render('admin/kilvish500')
    }
  }





  const SupportPost = async (req, res, next) => {
    const con = await connection();
  
    try {
      await con.beginTransaction();
  
      const [results] = await con.query(
        'INSERT INTO tbl_support (id, support_email, support_contact) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE support_email = VALUES(support_email), support_contact = VALUES(support_contact)',
        [1, req.body.support_email, req.body.support_contact]
      );
  
      const [[support]] = await con.query('SELECT * FROM tbl_support WHERE id = ?', [1]);
  
      await con.commit();
  
      if (results) {
        res.render('admin/addInquiryDetails', { output: 'Support Details Added Successfully !!', support: support });
      } else {
        res.render('admin/addInquiryDetails', { output: 'Failed to Add Support !! ', support: support });
      }
    } catch (error) {
      await con.rollback();
      console.error('Error in SupportPost API:', error);
      res.status(500).json({ result: 'Internal Server Error' });
    } finally {
      con.release();
    }
  };
  





  //================================= Query Tickets ========================================= 
  


  const queries = async(req,res,next)=>{ 


    const con = await connection(); 
    try {
      
      const [Queries] = await con.query('SELECT * FROM tbl_queries WHERE status IN (?, ?) ORDER BY id DESC', ['opened', 'closed']);
      res.render('admin/queries',{"output":"","queries":Queries})
    } catch (error) {
      res.render('admin/kilvish500')
    }
}


const QueriesPost = async(req,res,next)=>{

  const con = await connection(); 

  
  
  var queryID = req.body.id;

      if(req.body.status =='opened')
      {
          var newStatus = "closed"
      }
      else {
          var newStatus = "opened"
      }  
  
      const [results] = await con.query('UPDATE tbl_queries SET status = ? WHERE id = ?', [newStatus, queryID]);
          if(results){
              res.json({ msg: 'Action Taken on Query'})
       }
   
  
}



const sendMailtoUser = async (req, res, next) => {
  const con = await connection();

  try {
      const email = req.body.recipientEmail;
      const subject = req.body.emailSubject;
      const message = req.body.emailMessage;

      // Call the responsetoQuery function to send an email
      responsetoQuery(email, message, subject);

      // Fetch queries from the tbl_queries table
      const [Queries] = await con.query('SELECT * FROM tbl_queries WHERE status IN (?, ?) ORDER BY id DESC', ['opened', 'closed']);

      if (Queries) {
          res.render('queries', { "output": "Email Sent to " + email + " Successfully", "queries": Queries });
      } else {
          res.render('queries', { "output": "Failed to send Email", "queries": Queries });
      }
  } catch (error) {
      console.error('Error in sendMailtoUser API:', error);
      res.status(500).json({ result: 'Internal Server Error' });
  } finally {
      con.release();
  }
};





const appPass = async(req,res,next)=>{ 
  const con = await connection();
  try {

    const [rows] = await con.query('SELECT appEmail, appPassword FROM tbl_apppass WHERE id = ?', [1]);
    
    res.render('appPass',{"output":"","rows":rows})
    
  } catch (error) {
    res.render('admin/kilvish500', {'output':'Internal Server Error'});
    
  }

  }




//=================== set Google App pass to send email ============= 

const appPassPost = async (req, res, next) => {
  const con = await connection();

  try {
    await con.beginTransaction();

    const { appEmail, appPassword } = req.body;
    const sqlCheck = `SELECT * FROM tbl_apppass`;
    const [results] = await con.query(sqlCheck);

    if (results.length === 0) {
      const sqlInsert = `INSERT INTO tbl_apppass (appEmail, appPassword) VALUES (?, ?)`;
      await con.query(sqlInsert, [appEmail, appPassword]);
    } else {
      // Assuming you want to update the first record if it exists
      const sqlUpdate = `UPDATE tbl_apppass SET appEmail = ?, appPassword = ? WHERE id = ?`;
      await con.query(sqlUpdate, [appEmail, appPassword, results[0].id]);
    }

    await con.commit();
    res.render('appPass', { "output": "App Password Added Successfully, Email Service Activated" });
  } catch (error) {
    await con.rollback();
    console.error('Error:', error);
    res.render('appPass', { "output": "Failed to add App Password" });
  } finally {
    con.release();
  }
};






//======================== Rent Agreement Start ================================= 




  const rentAgreement = async(req,res,next)=>{   
    const con = await connection(); 
   
        try {
          const [agreements] = await con.query('SELECT * FROM tbl_addagreement ORDER BY id DESC');   


          if(agreements.length > 0){
              
            res.render('admin/rentAgreement',{'output':'ALL Agreements Fetched','agreements':agreements})
          }else{
            res.render('admin/rentAgreement',{'output':'No Agreement found','agreements':agreements})
          }

        
        } catch (error) {
          res.render('admin/kilvish500')
        }
   
    }



    const rentAgreementPost = async (req, res, next) => {
      const con = await connection();
    
      try {
        await con.beginTransaction();

        const [agreements] = await con.query('SELECT * FROM tbl_addagreement');   


        if(agreements.length >= 3 ){

          return res.render('admin/rentAgreement', { output: 'You can only add upto 3 Samples', agreements: agreements });
        }
    
        const agreementContent = decodeURIComponent(req.body.agreementContent);
    
        const agreementID = decodeURIComponent(req.body.agreementID); 
    


        const [result] = await con.query('SELECT * FROM tbl_addagreement where id = ?', [agreementID]);
    
        if (result.length > 0) {              

          const [results] = await con.query('UPDATE tbl_addagreement SET agreementContent = ? WHERE id = ?', [agreementContent, agreementID]);
    
          const [agreements] = await con.query('SELECT * FROM tbl_addagreement');
    
          if (results) {
            await con.commit();
            res.render('admin/rentAgreement', { output: 'Agreement Content Updated Successfully !!', agreements: agreements });
          } else {
            await con.rollback();
            res.render('admin/rentAgreement', { output: 'Failed to update Agreement Content', agreements: agreements });
          }
        } else {     
        
          const sql = 'INSERT INTO `tbl_addagreement` ( agreementContent ) VALUES (?)';
          const values = [agreementContent];
          const [results] = await con.query(sql, values);
          const [agreements] = await con.query('SELECT * FROM tbl_addagreement ORDER BY id DESC');
    
          if (results) {
            await con.commit();
            res.render('admin/rentAgreement', { output: 'Agreement Content Added Successfully !!', agreements: agreements });
          } else {
            await con.rollback();
            res.render('admin/rentAgreement', { output: 'Failed to add Agreement Content', agreements: agreements });
          }
        }
      } catch (error) {
        await con.rollback();
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      } finally {
        con.release();
      }
    };



    const  deleteAgreement= async (req, res)=>{
    
      const con = await connection();
      const agreementID = req.query.agreementID; 
      try {  
    
        await con.query('DELETE FROM tbl_addagreement WHERE id = ?', [agreementID]);
        const [agreements] = await con.query('SELECT * FROM tbl_addagreement ORDER BY id DESC');
    
        res.render('admin/rentAgreement', {'agreements':agreements,'output':'Agreement Sample Deleted'});
        
      } catch (error) {
    
        const [agreements] = await con.query('SELECT * FROM tbl_addagreement ORDER BY id DESC');
    
        res.render('admin/rentAgreement', {'agreements':agreements,'output':'Failed to Delete'});
        
      }finally{
    
        con.release();
      }
    
    
       
      }
    
  
    
  

     //------ view user's official Rent Agreement --------



      const viewAgreements = async(req,res,next)=>{   
        const con = await connection(); 
       
            try {
              const [agreements] = await con.query('SELECT * FROM tbl_rentagreements ORDER BY created_at DESC');   
    
    
              if(agreements.length > 0){
                for (let i = 0; i < agreements.length; i++) {
                  // Fetch owner information
                  const [ownerInfo] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [agreements[i].owner_id]);
  
                  // Fetch tenant information
                  const [tenantInfo] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [agreements[i].tenant_id]);
  
                  // Add owner full name to the agreement
                  console.log("agreement ownerInfo - ", ownerInfo)

                  console.log("agreement tenantInfo - ", tenantInfo)

                  if(ownerInfo){
                    agreements[i].owner_fullname = `${ownerInfo[0].firstname} ${ownerInfo[0].lastname}`;
                  }

                 if(tenantInfo){
                  agreements[i].tenant_fullname = `${tenantInfo[0].firstname} ${tenantInfo[0].lastname}`;
                 }
  
                  // Add tenant full name to the agreement
                 
              }
                  
                res.render('admin/viewagreements',{'output':'ALL Agreements Fetched','agreements':agreements})
              }else{
                res.render('admin/viewagreements',{'output':'No Agreement found','agreements':agreements})
              }
    
            
            } catch (error) {
              console.log("error in view Agreements --> ", error)
              res.render('admin/kilvish500')
            }
       
      }
    


  

      

      const updateAgreementStatus = async(req,res,next)=>{ 

        console.log(req.body)


        const con = await connection(); 
        try {
      
          await con.beginTransaction();     
      
          
          const { id, status } = req.body;
          const [result] = await con.query('UPDATE tbl_rentagreements SET status = ? WHERE id = ?', [status, id]);
            
          
      await con.commit();
          res.status(200).json({ kilvish:'active'});
        } catch (error) {
          await con.rollback();
          console.error("Database error:", error);
          res.status(500).json({ error: 'Internal Server Error' });
        }finally {
          con.release(); 
        }
        
      
      
      }
      





      //---------- add Locations -------- 

let jsonData = {

  "Jamaica": [
    "Black River",
    "Browns Town",
    "Gordon Town",
    "Gregory Park",
    "Kingston",
    "Mandeville",
    "May Pen",
    "Moneague",
    "Montego Bay",
    "Negril",
    "Ocho Rios",
    "Old Harbour",
    "Port Maria",
    "Portland Cottage",
    "Portmore",
    "Runaway Bay",
    "Spanish Town"
  ]

}


      
    const  addLocations= async (req, res)=>{  

    
      const con = await connection();
 
      try {  
            con.beginTransaction()            

      const selectQuery = 'SELECT * FROM tbl_locations ORDER BY country, city';
      const [locations ]= await con.query(selectQuery);


              res.render('admin/addLocations' , {jsonData , locations, "output":"Add Loation Here"})

            con.commit()
        
      } catch (error) {
    
            con.rollback()
            res.render('admin/kilvish500')
        
      }finally{
    
        con.release();
      }
    
    
       
      }
    

      const addLocationsPost = async (req, res) => {
        const con = await connection();    
        try {
            await con.beginTransaction();    
            // Assuming req.body contains the country and city data
            const { country, city } = req.body;    
            // Insert data into tbl_locations with timestamp

            const [existingLocation] = await con.query('SELECT * FROM tbl_locations WHERE country = ? AND city = ? ', [ country, city]);

            if (existingLocation.length > 0) {
             
              const selectQuery = 'SELECT * FROM tbl_locations ORDER BY country, city';
              const [locations ]= await con.query(selectQuery);

              return res.render('admin/addLocations', { locations, jsonData, 'output': 'Error: Can not add Duplicate City' });
            }
              




            const insertQuery = 'INSERT INTO tbl_locations (country, city) VALUES (?, ?)';
            await con.query(insertQuery, [country, city]);    
            // Render the 'admin/addLocations' view
                        
            await con.commit();
            res.redirect('/admin/addLocations')
        } catch (error) {
            await con.rollback();
            console.error('Error adding location:', error.message);
            res.status(500).send('Error adding location');
        } finally {
            con.release();
        }
    };
    
    
    
    //--------  Delete Location ---------  



    const deleteLocation = async (req, res) => {
      const con = await connection();
      try {
          await con.beginTransaction();
  
          // Assuming req.body contains the LocationID to be deleted
          const { LocationID } = req.body;
  
          // Delete location from tbl_locations based on LocationID
          const deleteQuery = 'DELETE FROM tbl_locations WHERE id = ?';
          await con.query(deleteQuery, [LocationID]);
         
  
          await con.commit();
          res.status(200).send({success:true});

      } catch (error) {
          await con.rollback();
          console.error('Error deleting location:', error.message);
          res.status(500).send('Error deleting location');
      } finally {
          con.release();
      }
  };
  
      



//--------------------- Export Start ------------------------------------------
export {homePage,
  loginPage,loginAdmin,logout,Profile,ProfilePost,updateadminpic,
  checkPass , changepass, addUser , viewUsers ,propType , notification ,
   addQuestion ,viewQuestions ,addSkills,viewSkills , userPrivacy ,
    tandc , faq, properties , queries, addInquiryDetails , 
    viewUser, updateUserStatus, viewUserPost, deleteUser, deleteUser1 ,
     propTypePost , updatepropType, deletepropType , deleteProperty ,
      updatePropertyStatus, addQuestionPost , viewQuestion, viewQuestionPost , skills , skillsPost , Deleteskill,
      deletepQues , editFAQ , deleteFAQ , addFAQ , SupportPost , tandcPost,
       userPrivacyPost, deleteuserPrivacy, deleteSkill , sendMailtoUser , QueriesPost ,
        deletetandc , appPass, appPassPost , ForgotPassword , sendOTP , verifyOTP , resetpassword , NotifyPost ,
      
        rentAgreement  , rentAgreementPost , deleteAgreement ,
         viewAgreements ,updateAgreementStatus , addLocations , addLocationsPost , deleteLocation }


         
