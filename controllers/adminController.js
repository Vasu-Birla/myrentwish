
import { sendTokenAdmin, sendTokenUser } from '../utils/jwtToken.js';
import connection from '../config.js';

const con = await connection();
import * as path from 'path';
import upload from '../middleware/upload.js';



import {hashPassword, comparePassword, sendWelcomeMsg} from '../middleware/helper.js'
import { response } from 'express';


//-------------------- Home page  ------------------------------ 


const homePage = async(req,res,next)=>{ 

  try {
    res.render('admin/index') 

  } catch (error) {
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



//---------------------- Admin Profile  view/edit ----------------------


const Profile= async(req,res,next)=>{    

  try {
    var admin = req.admin;
    res.render('admin/profile',{'admin':admin,"output":""})
    
  } catch (error) {
    res.render('admin/kilvish500', {'output':'Internal Server Error'});
  }
    
 
}


const ProfilePost= async(req,res,next)=>{   
  
  const con = await connection(); 
try {

  var image =  req.admin.image
  var imagePath=  req.admin.imagePath 
 if (req.file) {
   image =  req.file.filename ;
   imagePath=  req.file.path ;   
}

var uDetails = req.body; 
var userdata = {"firstname":uDetails.firstname,"lastname":uDetails.lastname,"email":uDetails.email,"username":uDetails.username,"contact":uDetails.contact, "image":image ,"imagePath":imagePath};
 await con.query('UPDATE tbl_admin SET ? WHERE email = ?', [userdata, uDetails.email]);

const [[user]] = await con.query('SELECT * FROM tbl_admin WHERE id = ?', [req.admin.id]);
res.render('admin/profile',{'user':user,"output":" Profile Updated Successfully !!"})
  
} catch (error) {
  const [[user]] = await con.query('SELECT * FROM tbl_admin WHERE id = ?', [req.admin.id]);

  res.render('admin/profile',{'user':user,"output":"Failed to  Updated Profile !!"})
  
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

    var [users] =  await con.query('SELECT * FROM tbl_users');
    
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

  await con.commit();
  res.render('admin/viewUser',{'user':user,"output":"Updated "+user.firstname+"'s Details"})

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
    var [users] =  await con.query('SELECT * FROM tbl_users');

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

    const [proptypes] = await con.query('SELECT * FROM tbl_proptype');
    res.render('admin/propType', { 'proptypes': proptypes, 'output': 'Property Type Fetched!!' });
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
      await con.beginTransaction();

      // Insert the prop_type value into tbl_proptype
      await con.query('INSERT INTO tbl_proptype (prop_type) VALUES (?)', [prop_type]);

      // Retrieve updated proptypes after insertion
      const [proptypes] = await con.query('SELECT * FROM tbl_proptype');

      await con.commit();
      res.render('admin/propType', { 'proptypes': proptypes, 'output': 'Property Type Added ' });
  } catch (error) {
      await con.rollback();
      res.render('admin/kilvish500');
  }finally{
    con.release();
  }
}


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

    var [props] =  await con.query('SELECT * FROM tbl_prop');
    
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




const updatePropertyStatus = async(req,res,next)=>{ 


  const con = await connection(); 
  try {

    await con.beginTransaction();
    
    const { prop_id, status } = req.body;
    const [result] = await con.query('UPDATE tbl_prop SET prop_status = ? WHERE prop_id = ?', [status, prop_id]);
  
      await con.commit();
    res.status(200).json({ msg:true,message: `Status Updated'}`});
  } catch (error) {
    await con.rollback();
    console.error("Database error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }finally {
    con.release(); 
  }
  


}




//--Notify user ------------- 

const notification = async(req,res,next)=>{    

  try {
    res.render('admin/notification') 
  } catch (error) {
    res.render('admin/kilvish500')
  }
    
 
}


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
    

    if (!['options_2', 'options_3', 'dropdown'].includes(question_type)) {
      await con.rollback();
      return res.json({ result: "Invalid question type" });
    }


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
    const [questions] = await con.query('SELECT * FROM tbl_questions');
    
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

const viewQuestionPost = async (req, res, next) => {  console.log("start updating..... .... ")
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








//====================== Skills Section ------------------

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



//-----------------------  Privacy Section Start ------------------------------ 


const userPrivacy = async(req,res,next)=>{ 

  try {
    res.render('admin/userPrivacy') 
  } catch (error) {
    res.render('admin/kilvish500')
  }

  }




//--------------------  Terms & Condition Section Start -------------------------------





const tandc = async(req,res,next)=>{ 
    
  
      try {
        res.render('admin/tandc') 
      } catch (error) {
        res.render('admin/kilvish500')
      }
 
  }


  
const faq = async(req,res,next)=>{ 

      try {
        res.render('admin/faq') 
      } catch (error) {
        res.render('admin/kilvish500')
      }
  }




  //------------------



  const addInquiryDetails = async(req,res,next)=>{ 

    try {
      res.render('admin/addInquiryDetails') 
    } catch (error) {
      res.render('admin/kilvish500')
    }
  }
  


  const queries = async(req,res,next)=>{ 

    try {
      res.render('admin/queries') 
    } catch (error) {
      res.render('admin/kilvish500')
    }
}





  



//--------------------- Export Start ------------------------------------------
export {homePage,
  loginPage,loginAdmin,logout,Profile,ProfilePost,updateadminpic,
  checkPass , changepass, addUser , viewUsers ,propType , notification ,
   addQuestion ,viewQuestions ,addSkills,viewSkills , userPrivacy ,
    tandc , faq, properties , queries, addInquiryDetails , 
    viewUser, updateUserStatus, viewUserPost, deleteUser, deleteUser1 ,
     propTypePost , updatepropType, deletepropType , deleteProperty ,
      updatePropertyStatus, addQuestionPost , viewQuestion, viewQuestionPost}


         
