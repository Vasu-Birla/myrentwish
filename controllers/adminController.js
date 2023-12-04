
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

    var image =  req.admin.image
  var imagePath=  req.admin.imagePath 
 if (req.file) {
   image =  req.file.filename ;
   imagePath=  req.file.path ;   
}
 await con.query('UPDATE tbl_admin SET image = ?, imagePath = ? WHERE id = ?', [image, imagePath, req.admin.id]);

    res.json({msg:"success"})    
  } catch (error) {
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

  try {
    res.render('admin/viewUsers')
  } catch (error) {
    res.render('admin/kilvish500')
  }
    
 
}


//===================================== Property Section ===========================


//------- add/view prop type ---------------

const propType = async(req,res,next)=>{    

  try {
    res.render('admin/propType')
  } catch (error) {
    res.render('admin/kilvish500')
  }
    
 
}


const properties = async(req,res,next)=>{    

  try {
    res.render('admin/properties')
  } catch (error) {
    res.render('admin/kilvish500')
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



const viewQuestions = async(req,res,next)=>{    

  try {
    res.render('admin/viewQuestions') 
  } catch (error) {
    res.render('admin/kilvish500')
  }
    
 
}




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
    tandc , faq, properties , queries, addInquiryDetails }


         
