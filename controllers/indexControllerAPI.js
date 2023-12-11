
import { sendTokenAdmin, sendTokenUser } from '../utils/jwtToken.js';
import connection from '../config.js';

const con = await connection();
import * as path from 'path';
import upload from '../middleware/upload.js';
import paypal from 'paypal-rest-sdk';
import { parse, format } from 'date-fns';

import { sendPushNotification } from '../middleware/helper.js';



paypal.configure({
    mode: 'sandbox', // Replace with 'live' for production
    client_id: 'AYOJoUhYl73jzhMUWhXw7mgmxewV9mLVZAMWa9yNnADGsvwheZ6ILHlENiZyaUoENqH0bFapZ-vQ08q5',
    client_secret: 'EBejIUXmiHwzhzd8BOFgxo1S9SSjdYpLDQlfaLXDikR29b_0soKr1nOjLPoMDSc8TRVBPlgFCNl-1xUo',
  });
  

import {hashPassword, comparePassword, sendMailOTP} from '../middleware/helper.js'

//-------------------- Register API Start  ------------------------------ 

var otp;-
function setValue()
      {
    otp =   Math.random();
      otp = otp * 1000000;
        otp = parseInt(otp);
          console.log(otp);
}




  const register = async (req, res, next) => {
    const con = await connection();
    try {
      console.log(req.body);
  
      const date = Date.now();
      const status = 'active';

   
      req.body.password = hashPassword(req.body.password);
  
      const image = ' ';
      const imagePath = ' ';
  
    
      await con.beginTransaction();
  
      // Check if the user already exists with the provided email
      const checkUserSql = 'SELECT COUNT(*) as count FROM `tbl_users` WHERE user_email = ?';
      const checkUserValues = [req.body.user_email];
  
      const [userResult] = await con.query(checkUserSql, checkUserValues);
  
      if (userResult[0].count > 0) {
        await con.rollback();
        return res.status(200).json({ result: 'Email already exists' });
      } else {
        const sql =
          'INSERT INTO `tbl_users` ( firstname, lastname, user_email,  password, user_mobile, birthday, location, latitude, longitude, address, country, city, gender, image, imagePath, prefered_gender, prefered_city, prefered_country, bedroom_nums, bathroom_type, parking_type, prefered_rent, about_me, skill) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
        const values = [
          req.body.firstname,
          req.body.lastname,
          req.body.user_email,
          req.body.password,
          req.body.user_mobile,
          req.body.birthday,
          req.body.location,
          req.body.latitude,
          req.body.longitude,
          req.body.address,
          req.body.country,
          req.body.city,
          req.body.gender,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          image,
          imagePath
        ];
  
        const [results] = await con.query(sql, values);
  
        await con.commit();
  
        const selectUserSql = 'SELECT * FROM `tbl_users` WHERE user_id = ?';
        var [[userDetails]] = await con.query(selectUserSql, [results.insertId]);

        // userDetails.user_id = userDetails.user_id.toString();
  
        userDetails = {result: 'success', ...userDetails,  };
      console.log(userDetails)
        res.json(userDetails);
      }
    } catch (error) {
      await con.rollback();
      console.error('Error in register API:', error);
      res.status(500).json({ result: 'Internal Server Error' });
    } finally {
    
        con.release()  // Close the database connection
    }
  };
  





//----------------  Register API End --------------------------

const Login = async (req, res, next) => {

 
   const con = await connection();
    try {
      
      await con.beginTransaction();
  
      const { user_email, password } = req.body;
  
      // If user doesn't enter email or password
      if (!user_email || !password) {
        res.json({ result: "Please Enter Email and Password" });
        return;
      }
  
      const [results] = await con.query('SELECT * FROM tbl_users WHERE user_email = ?', [user_email]);
      const user = results[0];

  
      if (!user) {
        res.json({ result: "Account does not exist!" });
        return;
      }
  
      let isValid = comparePassword(password, user.password);
  
      if (!isValid) {
        res.json({ result: "Incorrect Password" });
        return;
      }
  
      if (user.status === "active") {
        sendTokenUser(user, 200, res);
        await con.commit();
      } else {
        res.json({ result: "Your Account Has Been Deactivated!" });
      }
    } catch (error) {
      await con.rollback();
      console.error('Error in Login API:', error);
      res.json({ result: 'Internal Server Error' });
    } finally {      
        con.release();
    }
  };
  
 
  

const Logout = async(req,res,next)=>{     

    res.cookie("token",null,{
        expires : new Date(Date.now()),
        httpOnly:true
    })

    res.json({ result: "logout success" });

}

//---------------------- Login /Logout API end -------------------------------


//---------------------- Forgot Password start  -------------------------------





const ForgotPassword = async (req, res, next) => {
    const con = await connection();
    try {
      const { user_email } = req.body;
      var email = user_email
  
       otp =   Math.random();
      otp = otp * 1000000;
        otp = parseInt(otp);
          console.log(otp);
  
      if (!email) {
        res.json({ result: "Email Required " });
      } else {
        const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_email = ?', [email]);
  
        if (!user) {
          res.json({ result: "Invalid Email" });
        } else {
          sendMailOTP(email, otp, user);
          res.json({ result: "success", user_id: user.user_id, otp: otp });
        }
      }
    } catch (error) {
      console.error('Error in ForgotPassword API:', error);
      res.status(500).json({ result: 'Internal Server Error' });
    } finally {
      con.release();
    }
  };




//---------------------- Forgot Password End  -------------------------------


//============== Reset Password with the OTP sent from previous post Method  ------------




const resetpassword = async (req, res, next) => {
    const con = await connection();
  try {

    await con.beginTransaction();
    const userID = req.body.user_id;
    const newPassword = hashPassword(req.body.confirmPass);

    console.log(newPassword);

    const [results] = await con.query('UPDATE tbl_users SET password = ? WHERE user_id = ?', [newPassword, userID]);
    await con.commit();
    res.json({ result: "success" });

    // if (results && results.affectedRows > 0) {
    //   res.json({ result: "success" });
    // } else {
    //   res.json({ result: "failed" });
    // }
  } catch (error) {
    await con.rollback();
    console.error('Error in resetpassword API:', error);
    res.status(500).json({ result: 'failed' });
  } finally {
      con.release();
  }
};



//------------ delete User -------------- 


const  removeAccount = async(req,res,next)=>{ 

  const con = await connection();
  const userID = req.body.user_id; 

  try {  

    await con.beginTransaction();

    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
  
    if ( user.status == "inactive") {
      return res.json({ result: "failed", message:"Deactivated Profile Cannot be deleted" });
    } 
    await con.query('DELETE FROM tbl_users WHERE user_id = ?', [userID]);
   

    await con.commit();
    res.json({ result: "success", message:"Your Account has been deleted !" });
    
  } catch (error) {
    await con.rollback();
   
    res.json({ result: "failed", message:" Unable to delete Your Account  !" });
    
  }finally{
    con.release();
  }
  }





//-------------------- Product details ------------ 

const getProducts = async(req,res,next)=>{    
    const con = await connection(); 

    const [products] = await con.query('SELECT * FROM tbl_product');
    var userID = req.body.user_id

   
    for (const product of products) {
      
        const productId = product.product_id;    


        var [[result]] =  await con.query('SELECT * FROM tbl_fvt where user_id =? AND product_id = ? AND status = ?',[  userID ,productId, 'like']);
        
        if(result != undefined){
           product.status = 'like';
        }      

}
  
   

    for(let i=0; i<products.length; i++){
        const timestamp = parseInt(products[i].date, 10)
        const date = new Date(timestamp);
        products[i].date = date.toLocaleString();   

    }    
    
    if(products){
       // console.log(products)
        res.json(products)
    }else{
        res.json({"result":"No Product found"})
    }
 
    
}





const prodcutDetails = async(req,res,next)=>{ 
     
    var productID = req.body.id;
    var userID = req.body.user_id
    const con = await connection(); 

    const [[product]] = await con.query('SELECT * FROM tbl_product where product_id =?',[req.body.id]);

    const [[fvt]] = await con.query('SELECT * FROM tbl_fvt WHERE user_id = ? AND product_id = ?', [userID, productID]);
 
    const [sameCollection] = await con.query('SELECT * from tbl_col where product_id = ? ',[productID]); 

    if(fvt){
        product.status = 'like';
    }

    const timestamp = parseInt(product.date, 10)
    const date = new Date(timestamp);
    product.date = date.toLocaleString(); // Format: MM/DD/YYYY, HH:MM:SS AM/PM
    

    var similarSellers = []; 
    if(sameCollection){

        for (const row of sameCollection) {
      
            const userId = row.user_id;  
            var [[sellers]] = await con.query('SELECT * from tbl_user where id = ? ',[userId]); 

            sellers = {"By_Seller":row.user_id,...sellers,"modname":product.modname}
            similarSellers.push(sellers)
        }  
              
        const indexToRemove = similarSellers.findIndex(user => user.id === parseInt(userID));
        if (indexToRemove !== -1) {
            // Use splice to remove the object from the array
            similarSellers.splice(indexToRemove, 1);
          }        
      
     }
    

   var kilProdut = {...product,"Data":similarSellers}

    if(product){
        res.json(kilProdut); 
    }else{
        res.json({"result":"Failed to fetch Product "})
    }

     
    
}
//------------------Product details end ------------

//--------------------------------------Fvt  Products Section Start -------------------------


const addtoFVT = async(req,res,next)=>{ 

    const con = await connection(); 


    var newStatus ="like"
    var userID = req.body.user_id
    var productID = req.body.product_id
    const [[fvt]] = await con.query('SELECT * FROM tbl_fvt WHERE user_id = ? AND product_id = ?', [userID, productID]);

        if(fvt){

            const [result] = await con.query('DELETE FROM tbl_fvt WHERE user_id = ? AND product_id = ?', [userID, productID]);

            if(result){
                res.json({"result":"success"})
            }
            else { res.json({"result":"failed"})  }

            // if(fvt.status == 'like'){
            //      newStatus ="dislike"
            // }
            // else{
            //     newStatus ="like"
            // }
            // const [result] =  await con.query('UPDATE tbl_fvt SET status = ? WHERE user_id = ? AND product_id = ?', [newStatus, userID, productID]);
            // if(result){
            //     res.json({"result":"success"})
            // }
            // else { res.json({"result":"failed"})  }
        }
        else{

            const [result1] =  await con.query('INSERT INTO tbl_fvt (user_id, product_id, status) VALUES (?, ?, ?)', [userID, productID, newStatus]);  

            if(result1){
                res.json({"result":"success"})
            }
            else { res.json({"result":"failed"})  }
        
        }


      
  }
  

const fvtList = async(req,res,next)=>{ 

    const con = await connection(); 


  var userID = req.body.user_id
  var status = 'like';
  const [fvts] = await con.query(
    'SELECT p.*, f.user_id AS fvt_user_id ' +
    'FROM tbl_product p ' +
    'LEFT JOIN tbl_fvt f ON p.product_id = f.product_id ' +
    'WHERE f.user_id = ? AND f.status = ?',
    [userID, status]
  );

  const products = fvts.map((fvt) => {
    // Determine the status for each product
    const productStatus = fvt.fvt_user_id == userID ? 'like' : 'unlike';
    return { ...fvt, status: productStatus };
  });
  
//     const [fvts] = await con.query('SELECT * FROM tbl_fvt where user_id =? AND status = ?',[userID,status]);
//     var products = [];
//     for(let i=0; i<fvts.length; i++){
       
//         var pIDS  = fvts[i].product_id; 
//         var [[fvt]] = await con.query('SELECT * FROM tbl_product where product_id =?',[pIDS]);
//         products.push(fvt)   


//     } 

//     for (const product of products) {
      
//         const productId = product.product_id;    


//         var [[result]] =  await con.query('SELECT * FROM tbl_fvt where user_id =? AND product_id = ? AND status = ?',[  userID ,productId, 'like']);
        
//         if(result != undefined){
//            product.status = 'like';
//         }      

// }

    if(products.length > 0){
        res.json(products);
     
    }else{
        res.json({"result":"No fvt Product"})
        
    }
    
}

//--------------------------------------Fvt  Products Section end -------------------------



//------------------------------- add to collection / collecton List Start ----------------------- 


const addtocol = async(req,res,next)=>{ 
    const con = await connection(); 


    var newStatus ="added"
    var userID = req.body.user_id
    var productID = req.body.product_id
   
    const checkProductCol = 'SELECT COUNT(*) as count FROM `tbl_col` WHERE user_id = ? AND product_id = ?';

    const [colResult] = await con.query(checkProductCol, [userID, productID]);

    
     if (colResult[0].count > 0) {
        return  res.json( {result:'Already Added' });
    }
    else{

        const [result1] =  await con.query('INSERT INTO tbl_col (user_id, product_id,status) VALUES (?, ?,?)', [userID, productID,newStatus]);  

        if(result1){
            res.json({"result":"success"})
        }
        else { res.json({"result":"failed"})  }
    }

      
  }
  

const colList = async(req,res,next)=>{ 
    const con = await connection(); 


    var userID = req.body.user_id
    var status = 'added';
      const [collections] = await con.query('SELECT * FROM tbl_col where user_id =? AND status = ?',[userID,status]);
      var products = [];
      for(let i=0; i<collections.length; i++){
         
          var pIDS  = collections[i].product_id; 
          var [[col]] = await con.query('SELECT * FROM tbl_product where product_id =?',[pIDS]);
          products.push(col)   
  
  
      } 
  
      for (const product of products) {
        
          const productId = product.product_id;    
  
  
          var [[result]] =  await con.query('SELECT * FROM tbl_fvt where user_id =? AND product_id = ? AND status = ?',[  userID ,productId, 'like']);
          
          if(result != undefined){
             product.status = 'like';
          }      
  
  }
  
   
      if(products.length > 0){
          res.json(products);       
      }else{
          res.json(products)
      }
    
}


const removeFromCol = async(req,res,next)=>{ 

    const con = await connection(); 

    var userID = req.body.user_id
    var productID = req.body.product_id
   
    const [result] = await con.query('DELETE FROM tbl_col WHERE user_id = ? AND product_id = ?', [userID, productID]);

    if(result){
        res.json({"result":"removed"})
    }
    else { res.json({"result":"failed"})  }

      
  }



//----------------------------  collection end -----------------------------------------


//------------------------ Upload Product image by User ------------------


const updloadBYUser   = async(req,res,next)=>{   

    const con = await connection(); 


    var productID = req.body.product_id;
    var userID = req.body.user_id

     req.file.path = `http://${process.env.Host}/uploads/${req.file.filename}`;

     var imageName =  req.file.filename ;
     var imagePath=  req.file.path ;

     const [[product]] = await con.query('SELECT * FROM tbl_product where product_id =?',[productID]);
    

     const [result] =  await con.query('INSERT INTO tbl_images (imageName,image_path, product_id,product_name, user_id) VALUES (?,?,?,?,?)', [imageName,imagePath, productID,product.modname, userID]);  
     if(result){
        res.json({"result":"Image Request Sent to Admin"})
    }
    else { res.json({"result":"failed"})  }
     

}


//------------------------- upload end ---------------------


//------------------------ veiw/edit Single User Start  -------------------------


  const profile = async (req, res, next) => {
    const con = await connection();
    try {        
      const userID = req.body.user_id;
      const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
  
      if (user && user.status == "active") {
        res.json(user);
      } else {
        res.json({ result: "Deactivated User's Profile cannot be Open" });
      }
    } catch (error) {
      console.error('Error in profile API:', error);
      res.status(500).json({ result: 'Internal Server Error' });
    } finally {  
        con.release();
    }
  };



  const updateProfile = async (req, res, next) => {
    const con = await connection();
    try {
      
      await con.beginTransaction();
  
      const userID = req.body.user_id;
  
      // Fetch the existing user details
      const [[existingUser]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
  
      if (!existingUser) {
        await con.rollback();
        res.json({ result: "User not found" });
        return;
      }

   

      var image =  existingUser.image
      var imagePath=  existingUser.imagePath 
     if (req.file) {
       image =  req.file.filename ;
       imagePath=   req.file.path = `http://${process.env.Host1}/uploads/${req.file.filename}`; 
    }
  
      // Update user details
      const updatedUser = {
        firstname: req.body.firstname || existingUser.firstname,
        lastname: req.body.lastname || existingUser.lastname,
        user_email: req.body.user_email || existingUser.user_email,
        user_mobile: req.body.user_mobile || existingUser.user_mobile,
        birthday: req.body.birthday || existingUser.birthday,
        location: req.body.location || existingUser.location,
        latitude: req.body.latitude || existingUser.latitude,
        longitude: req.body.longitude || existingUser.longitude,
        address: req.body.address || existingUser.address,
        country: req.body.country || existingUser.country,
        city: req.body.city || existingUser.city,
        gender: req.body.gender || existingUser.gender,
        image: image,
        imagePath: imagePath
      };



      console.log(updatedUser)
        
      // Update the user details in the database
      const updateSql =
        'UPDATE tbl_users SET firstname=?, lastname=?, user_email=?, user_mobile=?, birthday=?, location=?, latitude=?, longitude=?, address=?, country=?, city=?, gender=?, image=?, imagePath=? WHERE user_id=?';
      const updateValues = [
        updatedUser.firstname,
        updatedUser.lastname,
        updatedUser.user_email,
        updatedUser.user_mobile,
        updatedUser.birthday,
        updatedUser.location,
        updatedUser.latitude,
        updatedUser.longitude,
        updatedUser.address,
        updatedUser.country,
        updatedUser.city,
        updatedUser.gender,
        updatedUser.image,
        updatedUser.imagePath,
        userID,
      ];
  
      await con.query(updateSql, updateValues);
  
      await con.commit();  
      res.json({ result: "success" });

    } catch (error) {
      // Rollback the transaction in case of an error
      await con.rollback();
      console.error('Error in updateProfile API:', error);
      res.status(500).json({ result: 'Internal Server Error' });
    } finally {    
        con.release();
    }
  };



  //------------------ Update Preference ---------------------


  const updatePreference = async (req, res, next) => {
      const con = await connection();
    try {
 
      await con.beginTransaction();  
      const userID = req.body.user_id;
  
      // Fetch the existing user details
      const [[existingUser]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
  
      if (!existingUser) {
        await con.rollback();
        res.json({ result: "User not found" });
        return;
      }
  
      // Update user preferences
      const updatedPreferences = {
        prefered_gender: req.body.prefered_gender || existingUser.prefered_gender,
        prefered_city: req.body.prefered_city || existingUser.prefered_city,
        prefered_country: req.body.prefered_country || existingUser.prefered_country,
        bedroom_nums: req.body.bedroom_nums || existingUser.bedroom_nums,
        bathroom_type: req.body.bathroom_type || existingUser.bathroom_type,
        parking_type: req.body.parking_type || existingUser.parking_type,
        prefered_rent: req.body.prefered_rent || existingUser.prefered_rent,
        about_me:req.body.about_me || existingUser.about_me,
        skill:req.body.skill || existingUser.skill
      };
  
      // Update the user preferences in the database
      const updateSql =
        'UPDATE tbl_users SET prefered_gender=?, prefered_city=?, prefered_country=?, bedroom_nums=?, bathroom_type=?, parking_type=?, prefered_rent=?,about_me=?, skill=?  WHERE user_id=?';
      const updateValues = [
        updatedPreferences.prefered_gender,
        updatedPreferences.prefered_city,
        updatedPreferences.prefered_country,
        updatedPreferences.bedroom_nums,
        updatedPreferences.bathroom_type,
        updatedPreferences.parking_type,
        updatedPreferences.prefered_rent,
        updatedPreferences.about_me,
        updatedPreferences.skill,
        userID,
      ];
  
      await con.query(updateSql, updateValues);
      await con.commit();
      res.json({ result: "success" });
  
    } catch (error) {
      // Rollback the transaction in case of an error
      await con.rollback();
      console.error('Error in updatePreference API:', error);
      res.status(500).json({ result: 'Internal Server Error' });
    } finally {
      if (con) {
        con.release();
      }
    }
  };
  









//====================================== Property Section Start ==================================== 



//--------- Add Property by User -------------------------- 




const addProperty = async (req, res, next) => {  console.log(req.files)
  const con = await connection();
  try {
   
    await con.beginTransaction();

  
    const userID = req.body.user_id;

    // Validate if the user exists
    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
    if (!user) {
      await con.rollback();
      return res.json({ result: "User not found" });
    }

    // Extract property details from the request body
    const {
      owner_name,
      owner_contact,
      owner_email,
      title,
      description,
      address,
      city,
      country,
      prop_type,
      bedroom_nums,
      bathroom_type,
      parking_type,
      size_sqft,
      rent_amount,
      available_date,
      prop_status, // Assuming this is part of the request body
    } = req.body;

    // Set is_available based on prop_status
    const is_available = prop_status === 'available';


    const images = req.files.map(file => ({path:`http://${process.env.Host1}/uploads/${file.filename}`}));

    console.log(images)

    //const formattedDate = format(new Date(available_date), 'yyyy-MM-dd');

    //const formattedDate = format(new Date(available_date), 'dd-MM-yyyy');

    // Insert property details into the tbl_prop table
    const insertSql =
      'INSERT INTO tbl_prop (user_id, owner_name, owner_contact, owner_email, title, description, address, city, country, prop_type, bedroom_nums, bathroom_type, parking_type, size_sqft, rent_amount, available_date, is_available, prop_status, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const insertValues = [
      userID,
      owner_name,
      owner_contact,
      owner_email,
      title,
      description,
      address,
      city,
      country,
      prop_type,
      bedroom_nums,
      bathroom_type,
      parking_type,
      size_sqft,
      rent_amount,
      available_date,
      is_available,
      prop_status,
      JSON.stringify(images)
     
    ];

    const [results] = await con.query(insertSql, insertValues);

    const selectPropertySql = 'SELECT * FROM `tbl_prop` WHERE prop_id = ?';
    var [[propertyDetails]] = await con.query(selectPropertySql, [results.insertId]);

console.log(propertyDetails)
    propertyDetails.images = JSON.parse(propertyDetails.images) 
    propertyDetails.available_date = format(new Date(propertyDetails.available_date), 'yyyy-MM-dd');

    await con.commit();
    res.json({result: 'success', ...propertyDetails,  });
  } catch (error) {
    // Rollback the transaction in case of an error
    await con.rollback();
    console.error('Error in addProperty API:', error);
    res.status(500).json({ result: 'Internal Server Error' });
  } finally {
    if (con) {
      con.release();
    }
  }
};







//---------- fetch Properties -------
// const Properties = async (req, res, next) => {
// const  con = await connection();
//   try {
  
//     await con.beginTransaction();
//     const userID = req.body.user_id;

//     // Validate if the user exists
//     const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
//     if (!user) {
//       await con.rollback();
//       return res.json({ result: "User not found" });
//     }
//     //const selectPropertiesSql = 'SELECT * FROM `tbl_prop` WHERE user_id <> ?';
//     const selectPropertiesSql = 'SELECT * FROM `tbl_prop` WHERE user_id != ?';
//     const [properties] = await con.query(selectPropertiesSql, [userID]);
   
//     for (const row of properties) {

//       row.images = JSON.parse(row.images) 
//       row.available_date = format(new Date(row.available_date), 'yyyy-MM-dd');
//   }  

//     await con.commit();
//     res.json( properties );
//   } catch (error) {
//     // Rollback the transaction in case of an error
//     await con.rollback();
//     console.error('Error in fetchAllProperties API:', error);
//     res.status(500).json({ result: 'Internal Server Error' });
//   } finally {
//       con.release();
//   }
// };



const Properties = async (req, res, next) => {
  const con = await connection();

  try {
    const userID = req.body.user_id;

    // Validate if the user exists
    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
    if (!user) {
      return res.json({ result: "User not found" });
    }

    const page = req.body.page_number || 1; // Default to page 1 if not provided
    const resultsPerPage = 5;
    const offset = (page - 1) * resultsPerPage;



    
    // Fetch total number of questions for pagination calculation
    const [totalPropsResult] = await con.query('SELECT COUNT(*) as total FROM tbl_prop');
    const totalProperties = totalPropsResult[0].total;

    // Calculate total number of pages
    var totalPages = Math.ceil(totalProperties / resultsPerPage);
    totalPages = totalPages.toString();

  



    const selectPropertiesSql = 'SELECT * FROM `tbl_prop` WHERE user_id != ? LIMIT ? OFFSET ?';
    const [properties] = await con.query(selectPropertiesSql, [userID, resultsPerPage, offset]);

    for (const row of properties) {
      row.images = JSON.parse(row.images);
      row.available_date = format(new Date(row.available_date), 'yyyy-MM-dd');
    }

    const formattedproperties = Object.values(properties);

    const result = {  totalPages,  properties: formattedproperties };

    //var props ={"totalPages":totalPages,...properties }  ; 
    res.json(result);

  } catch (error) {
    console.error('Error in fetchAllProperties API:', error);
    res.status(500).json({ result: 'Internal Server Error' });
  } finally {
    if (con) {
      con.release();
    }
  }
};



//-------- fetch my properties -------

const myProperties = async (req, res, next) => {
  const  con = await connection();
    try {
      await con.beginTransaction();
      const userID = req.body.user_id;
  
      const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
      if (!user) {
        await con.rollback();
        return res.json({ result: "User not found" });
      }
  
      const selectPropertiesSql = 'SELECT * FROM `tbl_prop` WHERE user_id = ?';  
      const [properties] = await con.query(selectPropertiesSql, [userID]);

      for (const row of properties) {

        row.images = JSON.parse(row.images) 
        row.available_date = format(new Date(row.available_date), 'yyyy-MM-dd');
    }    
    
      await con.commit();
      res.json( properties );
    } catch (error) {
      // Rollback the transaction in case of an error
      await con.rollback();
      console.error('Error in fetchAllProperties API:', error);
      res.status(500).json({ result: 'Internal Server Error' });
    } finally {
        con.release();
    }
  };


  //-------------fetch single Property ----- 

const property = async (req, res, next) => {
  const con = await connection();
  try {        
    const prop_id = req.body.prop_id;
    const [[property]] = await con.query('SELECT * FROM tbl_prop WHERE prop_id = ?', [prop_id]);

    if (!property) {
      return res.json({ result: "Property Not Found" });
     
    } 

    property.images = JSON.parse(property.images) 
    property.available_date = format(new Date(property.available_date), 'yyyy-MM-dd');

    res.json(property);
  } catch (error) {
    console.error('Error in profile API:', error);
    res.status(500).json({ result: 'Internal Server Error' });
  } finally {  
      con.release();
  }
};



  //------------- Update Property --------------------- 


const updateProperty = async (req, res, next) => {
 const con = await connection();
  try {
   
    await con.beginTransaction();

    const userID = req.body.user_id;
    const propertyID = req.body.prop_id;

    // Validate if the user exists
    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
    if (!user) {
      await con.rollback();
      return res.json({ result: "User not found" });
    }

    // Validate if the property exists and is owned by the user
    const [[property]] = await con.query('SELECT * FROM `tbl_prop` WHERE prop_id = ? AND user_id = ?', [propertyID, userID]);
    if (!property) {
      await con.rollback();
      return res.json({ result: "Property not found or does not belong to the user" });
    }

    // Extract property details from the request body
    const {
      owner_name,
      owner_contact,
      owner_email,
      title,
      description,
      address,
      city,
      country,
      prop_type,
      bedroom_nums,
      bathroom_type,
      parking_type,
      size_sqft,
      rent_amount,
      available_date,
      prop_status, // Assuming this is part of the request body
    } = req.body;

    // Set is_available based on prop_status
    const is_available = prop_status === 'available';

    // Convert uploaded file data to an array of image paths
    const images = req.files
      ? req.files.map(file => ({ path: `http://${process.env.Host1}/uploads/${file.filename}` }))
      : JSON.parse(property.images); // Use existing images if no new images are provided

    // Create an object with updated property details
    const updatedPropertyDetails = {
      owner_name: owner_name || property.owner_name,
      owner_contact: owner_contact || property.owner_contact,
      owner_email: owner_email || property.owner_email,
      title: title || property.title,
      description: description || property.description,
      address: address || property.address,
      city: city || property.city,
      country: country || property.country,
      prop_type: prop_type || property.prop_type,
      bedroom_nums: bedroom_nums || property.bedroom_nums,
      bathroom_type: bathroom_type || property.bathroom_type,
      parking_type: parking_type || property.parking_type,
      size_sqft: size_sqft || property.size_sqft,
      rent_amount: rent_amount || property.rent_amount,
      available_date: available_date || property.available_date,
      is_available: is_available || property.is_available,
      prop_status: prop_status || property.prop_status,
      images: JSON.stringify(images),
    };

    // Update property details in the tbl_prop table
    const updateSql =
      'UPDATE tbl_prop SET owner_name=?, owner_contact=?, owner_email=?, title=?, description=?, address=?, city=?, country=?, prop_type=?, bedroom_nums=?, bathroom_type=?, parking_type=?, size_sqft=?, rent_amount=?, available_date=?, is_available=?, prop_status=?, images=? WHERE prop_id=?';
    const updateValues = [
      updatedPropertyDetails.owner_name,
      updatedPropertyDetails.owner_contact,
      updatedPropertyDetails.owner_email,
      updatedPropertyDetails.title,
      updatedPropertyDetails.description,
      updatedPropertyDetails.address,
      updatedPropertyDetails.city,
      updatedPropertyDetails.country,
      updatedPropertyDetails.prop_type,
      updatedPropertyDetails.bedroom_nums,
      updatedPropertyDetails.bathroom_type,
      updatedPropertyDetails.parking_type,
      updatedPropertyDetails.size_sqft,
      updatedPropertyDetails.rent_amount,
      updatedPropertyDetails.available_date,
      updatedPropertyDetails.is_available,
      updatedPropertyDetails.prop_status,
      updatedPropertyDetails.images,
      propertyID,
    ];

    await con.query(updateSql, updateValues);

    // Optionally, you can retrieve the updated property details if needed
    const selectUpdatedPropertySql = 'SELECT * FROM `tbl_prop` WHERE prop_id = ?';
    const [[finalUpdatedPropertyDetails]] = await con.query(selectUpdatedPropertySql, [propertyID]);

    finalUpdatedPropertyDetails.images = JSON.parse(finalUpdatedPropertyDetails.images);
    finalUpdatedPropertyDetails.available_date = format(new Date(finalUpdatedPropertyDetails.available_date), 'yyyy-MM-dd');

    console.log("updated Successfully ->> ", finalUpdatedPropertyDetails)

    await con.commit();
    res.json({ result: 'success', ...finalUpdatedPropertyDetails });

    
  } catch (error) {
    // Rollback the transaction in case of an error
    await con.rollback();
    console.error('Error in updateProperty API:', error);
    res.status(500).json({ result: 'Internal Server Error' });
  } finally {
    if (con) {
      con.release();
    }
  }
};






//--------  Delete Property ---------------


const deleteProperty = async (req, res, next) => {
  const con = await connection();
  try {
    await con.beginTransaction();

    const userID = req.body.user_id;
    const propertyID = req.body.prop_id;

    // Validate if the user exists
    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
    if (!user) {
      await con.rollback();
      return res.json({ result: "User not found" });
    }

    // Validate if the property exists and is owned by the user
    const [[property]] = await con.query('SELECT * FROM `tbl_prop` WHERE prop_id = ? AND user_id = ?', [propertyID, userID]);
    if (!property) {
      await con.rollback();
      return res.json({ result: "Property not found or does not belong to the user" });
    }

    // Delete the property from the tbl_prop table
    const deleteSql = 'DELETE FROM tbl_prop WHERE prop_id = ?';
    const [result] = await con.query(deleteSql, [propertyID]);

    await con.commit();
    console.log("Property Deleted Successfully ")
    res.json({ result: "success", message: "Property deleted successfully" });

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


//-------------------- get property types ---------- 



const propTypes = async (req, res, next) => {
  const con = await connection();

  try {

    const selectSql = 'SELECT * FROM tbl_proptype';
    const [propTypes] = await con.query(selectSql);  

    res.json( propTypes );

  } catch (error) {
    console.error('Error in getQuestions API:', error);
    res.status(500).json({ result: 'failed' , message:'Internal Server Error' });

  } finally {
    if (con) {
      con.release();
    }
  }
};




//----------- add to interest ------------- 

const addToInterest = async (req, res, next) => {
  const con = await connection();
  try {
    await con.beginTransaction();

    const userID = req.body.user_id;
    const propertyID = req.body.prop_id;

    // Check if the user and property exist
    const [userResult] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
    const [propertyResult] = await con.query('SELECT * FROM tbl_prop WHERE prop_id = ?', [propertyID]);

    if (!userResult[0] || !propertyResult[0]) {
      await con.rollback();
      return res.json({ result: "User or Property not found" });
    }

    // Check if the user is already interested in the property
    const [existingInterest] = await con.query('SELECT * FROM tbl_interest WHERE user_id = ? AND prop_id = ?', [userID, propertyID]);

    if (existingInterest.length > 0) {
      await con.rollback();
      return res.json({ result: "User is already interested in this property" });
    }

    // Retrieve the owner's user_id from the tbl_prop table
    const [ownerResult] = await con.query('SELECT user_id FROM tbl_prop WHERE prop_id = ?', [propertyID]);

    if (!ownerResult[0]) {
      await con.rollback();
      return res.json({ result: "Owner not found for this property" });
    }

    const ownerID = ownerResult[0].user_id;
  

    // Add the interest to tbl_interest table
    const insertSql = 'INSERT INTO tbl_interest (user_id, prop_id) VALUES (?, ?)';
    await con.query(insertSql, [userID, propertyID]);

    await con.commit();
    //await sendPushNotification(ownerID, userID);
    res.json({ result: "success", message: "Added to interest list successfully" });

  } catch (error) {
    // Rollback the transaction in case of an error
    await con.rollback();
    console.error('Error in addToInterest API:', error);
    res.status(500).json({ result: 'Internal Server Error' });

  } finally {
    if (con) {
      con.release();
    }
  }
};



//=================================== Questions  section ====================================== 




const getQuestions = async (req, res, next) => {
  const con = await connection();

  

  try {
    const page = req.body.page_number || 1; // Default to page 1 if not provided
    const resultsPerPage = 10;
    const offset = (page - 1) * resultsPerPage;



    // Fetch total number of questions for pagination calculation
    const [totalQuestionsResult] = await con.query('SELECT COUNT(*) as total FROM tbl_questions');
    const totalQuestions = totalQuestionsResult[0].total;

    // Calculate total number of pages
    var totalPages = Math.ceil(totalQuestions / resultsPerPage);


    // Fetch 10 questions based on the page and resultsPerPage
    const selectSql = 'SELECT * FROM tbl_questions LIMIT ? OFFSET ?';
    const [questions] = await con.query(selectSql, [resultsPerPage, offset]);



     // Fetch answers from tbl_user_answers
     const questionIds = questions.map(question => question.question_id);
     const [userAnswers] = await con.query('SELECT question_id, answer FROM tbl_user_answers WHERE user_id = ? AND question_id IN (?)', [req.body.user_id, questionIds]);
 
     // Map user answers to questions
     const userAnswersMap = {};
     userAnswers.forEach(answer => {
       userAnswersMap[answer.question_id] = answer.answer;
     });

    

    // Parse JSON strings in answer_options column
    var formattedQuestions =  questions.map((question, index) => {
      question.answer_options = JSON.parse(question.answer_options);
     // question = {"answer":"",...question }
      question.answer = userAnswersMap[question.question_id] || ''; // Set user answer or empty string
      question.question_num = (offset + index + 1).toString();

      return question;

      
    });


              totalPages = totalPages.toString();

            const formattedQuestionsArray = Object.values(formattedQuestions);

            const result = {  totalPages,  questions: formattedQuestionsArray };

    res.json(result);


  } catch (error) {
    console.error('Error in getQuestions API:', error);
    res.status(500).json({ result: 'Internal Server Error' });
  } finally {
    if (con) {
      con.release();
    }
  }
};



// const getQuestions = async (req, res, next) => {
//   const con = await connection();

//   try {
//     const resultsPerPage = 10;
//     const currentPage = req.headers['x-page'] || 1; // Default to page 1 if not provided

//     const offset = (currentPage - 1) * resultsPerPage;

//     // Fetch 10 questions based on the currentPage and resultsPerPage
//     const selectSql = 'SELECT * FROM tbl_questions LIMIT ? OFFSET ?';
//     const [questions] = await con.query(selectSql, [resultsPerPage, offset]);

//     // Parse JSON strings in answer_options column
//     const formattedQuestions = questions.map(question => {
//       question.answer_options = JSON.parse(question.answer_options);
//       return question;
//     });

//     res.json(formattedQuestions);
//   } catch (error) {
//     console.error('Error in getQuestions API:', error);
//     res.status(500).json({ result: 'Internal Server Error' });
//   } finally {
//     if (con) {
//       con.release();
//     }
//   }
// };





//---------------  insert User's Answer 


// const addAnswer = async (req, res, next) => {
//   const con = await connection();

//   try {
//     await con.beginTransaction();

//     const { user_id, question_id, answer } = req.body;

//     // Validate if the user and question exist
//     const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [user_id]);
//     const [[question]] = await con.query('SELECT * FROM tbl_questions WHERE question_id = ?', [question_id]);

//     if (!user || !question) {
//       await con.rollback();
//       return res.json({ result: "User or question not found" });
//     }

//     if (!question.answer_options.includes(answer)) {
//       await con.rollback();
//       return res.json({ result: "failed", message: "Incorrect answer" });
//     }

//     const insertSql = `
//   INSERT INTO tbl_user_answers (user_id, question_id, question, answer)
//   VALUES (?, ?, ?, ?)
//   ON DUPLICATE KEY UPDATE
//     answer = VALUES(answer),
//     updated_at = CURRENT_TIMESTAMP
// `;
//     const [results] = await con.query(insertSql, [user_id, question_id, question.question_text, answer]);

//     await con.commit();
//     res.json({ result: "success", answer_id: results.insertId });

//   } catch (error) {
//     // Rollback the transaction in case of an error
//     await con.rollback();
//     console.error('Error in answerQuestion API:', error);
//     res.status(500).json({ result: 'Internal Server Error' });

//   } finally {
//     if (con) {
//       con.release();
//     }
//   }
// };




//--------- for multipule answer -----------------------  


const addAnswer = async (req, res, next) => {
  console.log("req.body -->>>", req.body)
  const con = await connection();

  try {
    await con.beginTransaction();

    var { user_id, answers } = req.body;

     answers = JSON.parse(answers);

    console.log(answers)

    // Validate if the user exists
    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [user_id]);
    if (!user) {
      await con.rollback();
      return res.json({ result: "User not found" });
    }

    // Fetch all questions to validate answers
    const questionIds = answers.map(answer => answer.question_id);
    const [questions] = await con.query('SELECT * FROM tbl_questions WHERE question_id IN (?)', [questionIds]);

    const questionMap = new Map(questions.map(question => [question.question_id, question]));

    // Validate answers
    const invalidAnswers = answers.filter(answer => {
      const question = questionMap.get(answer.question_id);
      return !question || !question.answer_options.includes(answer.answer);
    });

    if (invalidAnswers.length > 0) {
      await con.rollback();
      return res.json({ result: "failed", message: "Invalid question or answer", invalidAnswers });
    }

    // Insert or update answers
    const insertSql = `
      INSERT INTO tbl_user_answers (user_id, question_id, question, answer)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        answer = VALUES(answer),
        updated_at = CURRENT_TIMESTAMP
    `;

    const insertPromises = answers.map(answer =>
      con.query(insertSql, [user_id, answer.question_id, questionMap.get(answer.question_id).question_text, answer.answer])
    );

    await Promise.all(insertPromises);

    await con.commit();
    res.json({ result: "success" });

  } catch (error) {
    // Rollback the transaction in case of an error
    await con.rollback();
    console.error('Error in addAnswer API:', error);
    res.status(500).json({ result: 'Internal Server Error' });

  } finally {
    if (con) {
      con.release();
    }
  }
};





//==============================================  NOTIFICATION SECTOIN =========================

const obtainToken = async (req, res, next) => {
  const con = await connection();

  try {
    await con.beginTransaction();

    const userID = req.body.user_id;
    const device_token = req.body.device_token;
    const device_status = req.body.device_status;
    const created_at = Date.now();
    const updated_at = Date.now();

    // Check if a record already exists for this user and device token
    const [existingRecords] = await con.query('SELECT * FROM tbl_fcm WHERE user_id = ? AND device_token = ?', [userID, device_token]);

    const [[existingDeviceID]] = await con.query('SELECT * FROM tbl_fcm WHERE device_token = ?', [device_token]);

    if (existingRecords.length > 0) {
      console.log("Existing DeviceID");

      const [result] = await con.query('UPDATE tbl_fcm SET device_status = ?, updated_at = ? WHERE user_id = ? AND device_token = ?', [device_status, updated_at, userID, device_token]);

      if (result) {
        res.json({ "result": "success" });
      } else {
        res.json({ "result": "failed" });
      }
    } else {
      console.log("New DeviceID");

      if (existingDeviceID) {
        console.log("Duplicate Device Found & Set for Current User Successfully");

        await con.query('DELETE FROM tbl_fcm WHERE user_id = ? AND device_token = ?', [existingDeviceID.user_id, device_token]);
      }

      const [result] = await con.query('INSERT INTO tbl_fcm (user_id, device_token, device_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)', [userID, device_token, device_status, created_at, updated_at]);

      if (result) {
        res.json({ "result": "success" });
      } else {
        res.json({ "result": "failed" });
      }
    }

    await con.commit();
  } catch (error) {
    await con.rollback();
    console.error('Error in obtainToken API:', error);
    res.status(500).json({ "result": "Internal Server Error" });
  } finally {
    if (con) {
      con.release();
    }
  }
};









//------------  machine  testing API -> 


const addtestUser = async(req,res,next)=>{ 


  const con = await connection();
try {
  const { name, email, birthday, password } = req.body;

  const sql = 'INSERT INTO `tbl_register` (name, email, birthday, password) VALUES (?, ?, ?, ?)';
  const values = [name, email, birthday, password];

  const [result] = await con.execute(sql, values);

  // Assuming 'result.insertId' contains the ID of the newly inserted user
  const insertedUserId = result.insertId;

  res.status(200).json({ result: 'success', userId: insertedUserId });
} catch (error) {
  console.error('Error in register API:', error);
  res.status(500).json({ result: 'failed' });
}finally{
  con.release();
}

}




const logintestUser = async(req,res,next)=>{ 
  const con = await connection();
  try {
    const { email, password } = req.body;
    const [result] = await con.execute('SELECT * FROM `tbl_register` WHERE email = ?', [email]);

    if (result.length == 0) {
      res.status(401).json({ result: 'Invalid email or password' });
      return;
    }

    const user = result[0];


    if (password == user.password) {
      // Passwords match, user is authenticated
      res.status(200).json({ result: 'success', userId: user.user_id });
    } else {
      // Passwords do not match
      res.status(401).json({ result: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error in login API:', error);
    res.status(500).json({ result: 'Failed to authenticate user' });
  }finally{
    con.release();
  }

  }
  
  




//------------ OLD APIS ---


const profilePost = async(req,res,next)=>{    
    const con = await connection(); 


    const userID = req.body.user_id;
    const [[user]] = await con.query('SELECT * FROM tbl_user WHERE id = ?', [userID ]);
    var uDetails = req.body; 
 
    var image =  user.image
    var imagePath=  user.imagePath 
   if (req.file) {
     image =  req.file.filename ;
     imagePath=   req.file.path = `http://${process.env.Host}/uploads/${req.file.filename}`; 
  }

 

  if(user.password != uDetails.password ){
    uDetails.password = hashPassword(uDetails.password);
  }
     
   
var userdata = {"email":user.email,"firstname":uDetails.name,"lastname":"","password":uDetails.password, "image":image ,"imagePath":imagePath,"status":user.status,"date":user.date};

const [results] = await con.query('UPDATE tbl_user SET ? WHERE email = ?', [userdata, uDetails.email]);

if(results){
    console.log(results.affectedRows + ' row(s) updated'); 

    res.json({ result: "success"});   
}else{
    res.json({ result: "failed"}); 
}

    
}







//----------------- Similar collection suggestion --------------------- 

const similarColl = async (req,res,next)=>{ 
    const con = await connection(); 


    var productID = req.body.id;
    var userID = req.body.user_id


    const [[product]] = await con.query('SELECT * FROM tbl_product where product_id =?',[req.body.id]);

    const [[fvt]] = await con.query('SELECT * FROM tbl_fvt WHERE user_id = ? AND product_id = ?', [userID, productID]);
 
    const [sameCollection] = await con.query('SELECT * from tbl_col where product_id = ? ',[productID]); 

    if(fvt){
        product.status = 'like';
    }

    const timestamp = parseInt(product.date, 10)
    const date = new Date(timestamp);
    product.date = date.toLocaleString(); // Format: MM/DD/YYYY, HH:MM:SS AM/PM

    var similarSellers = []; 
    if(sameCollection){

        for (const row of sameCollection) {
      
            const userId = row.user_id;  
            var [[sellers]] = await con.query('SELECT * from tbl_user where id = ? ',[userId]); 

            sellers = {"By_Seller":row.user_id,...sellers,"modname":product.modname}
            similarSellers.push(sellers)
        }  
              
        const indexToRemove = similarSellers.findIndex(user => user.id === parseInt(userID));
        if (indexToRemove !== -1) {
            // Use splice to remove the object from the array
            similarSellers.splice(indexToRemove, 1);
          }        
      
     }
    

   var kilProdut = {...product,"Data":similarSellers}

    if(product){
        res.json(kilProdut); 
    }else{
        res.json({"result":"Failed to fetch Product "})
    }



 

    
}

// -------------- similar collection End ---------------------


//----------------- About Us API start -------------------------- 

const aboutUs= async(req,res,next)=>{ 
    const con = await connection(); 

    const [[about]] = await con.query('SELECT * FROM tbl_about');
   // res.send(about.aboutus)
    //res.send(" http://62.72.5.222:3005/rules/aboutus.html")
    res.json({"result":about.aboutus})
}

const aboutUs1= async(req,res,next)=>{ 
    const con = await connection(); 


    const [[about]] = await con.query('SELECT * FROM tbl_about');
   // res.send(about.aboutus)
    // res.send(" http://62.72.5.222:3005/rules/aboutus.htm")
    res.json({"result":about.aboutus})
}

//------------------ About Us End -----------------------------

//----------------- Terms & C  API start -------------------------- 

const TC_User = async(req,res,next)=>{ 
    const con = await connection(); 


    const [TandC] = await con.query('SELECT * FROM tbl_tandc');

    if(TandC.length>0){
        
        res.json({"result":TandC[0].terms})
    }else{
        
        res.json({"result":TandC})
    }

  //  res.send(" http://62.72.5.222:3005/rules/tandc.html")

   // res.send(TandC.terms)
    
    
}

//------------------ Terms & C Us End -----------------------------


//----------------- UserPrivacy  API start -------------------------- 

const UserPrivacy  = async(req,res,next)=>{ 
    const con = await connection(); 


    const [[privacy]] = await con.query('SELECT * FROM tbl_pandp');

    //res.send(" http://62.72.5.222:3005/rules/userprivacy.html")
    //res.send(privacy.privacy)
    res.json({"result":privacy.privacy})
}

//------------------ UserPrivacy  End -----------------------------


//---------------------- Contact US Start ------------------------ 

const contactUS  = async(req,res,next)=>{ 
    const con = await connection(); 

    var status = "opened"
    var userID =req.body.user_id

    const [result] =  await con.query('INSERT INTO tbl_queries (user_id, subject, email, message, status) VALUES (?, ?, ?,?,?)', [userID, req.body.subject, req.body.email,req.body.message, status]);  

    if(result){
        res.json({"result":"success"})
    }
    else {         
        res.json({"result":"failed"}) 
        }

   
}


//---------------------- contact us End ---------------------------


//---------------- Paypal Payment Start ---------------------




const createPayment = async(req,res,next)=>{  console.log(req.body)
    const con = await connection(); 


    const { amount, currency } = req.body;
    var userID = req.body.user_id;  

    var productID = req.body.product_id;

   // const returnUrl = `http://${process.env.Host}/api/success?userId=${userId}&token=${token}`;

    //const returnUrl = `http://62.72.5.222:3005/api/success`;

    var [result] =  await con.query('SELECT * FROM tbl_payment where user_id =? AND product_id = ?',[ userID , productID]);

    if(result.length >0){
        res.json({"result":"success"})

    }else{
        //res.json({"result":result})
        const createPaymentJson = {
            intent: 'sale',
            payer: {
              payment_method: 'paypal',
            },
            transactions: [
              {
                amount: {
                  total: amount,
                  currency: currency,
                },
              },
            ],
            redirect_urls: {
                return_url: `http://62.72.5.222:3005/api/success?userID=${userID}&productID=${productID}`,
                cancel_url: 'http://62.72.5.222:3005/api/cancel', // Replace with your cancel URL
            },
        };
         
          
    
          paypal.payment.create(createPaymentJson, (error, payment) => {  console.log(" Main hited")
    
            if (error) {
              res.status(500).json({ error: 'Failed to create payment' });
            } else {
              const approvalUrl = payment.links.find((link) => link.rel === 'approval_url').href;
              //token = approvalUrl.match(/(EC-[0-9a-zA-Z]+)/)[0];
             // res.json({ approvalUrl });
             res.json({"result":approvalUrl})
    
             // res.redirect(returnUrl)
             // res.redirect(approvalUrl);
            }
          });

    }   

      

   

      
}


const successPayment = async(req,res,next)=>{   console.log(req.query.userID)
    const con = await connection(); 


    const paymentId = req.query.paymentId

    const PayerID = req.query.PayerID

    const userID = req.query.userID

    const productID = req.query.productID

    const timestamp = Date.now(); 

    const status = 'done';

   


    const executePaymentJson = {
      payer_id: PayerID,
    };
  
     paypal.payment.execute(paymentId, executePaymentJson,  (error) => {
      if (error) { 
        //res.json({"result":"success"})
        res.redirect('/api/cancel'); // Redirect to cancel page on payment failure
      } else {    

        console.log("success payment")
        kil(userID,productID)
        // Payment successful, update the user's account status here
        // Grant access to the chat service and render a success page
        res.json({"result":"success"})
      }
    });

    async function kil(userID, productID){
        console.log("  insert payment in DB ")

      const [result] =  await con.query('INSERT INTO tbl_payment (product_id ,user_id, timestamp, status) VALUES (?, ?, ?, ?)', [productID,userID, timestamp ,status]);

            if(result){
                console.log("Payment Done and Inserted in DB")
            }else{
                console.log("Payment Done BUT Not inserted in DB ")
            }
    }



}


const donePayment = async(req,res,next)=>{ 

    res.json(req.query)

   // res.status(400).json({"result":"failed"})

}

const cancelPayment = async(req,res,next)=>{ 
    res.status(400).json({"result":"failed"})

}

const paymentStatus = async(req,res,next)=>{ 

    const con = await connection(); 


    const { amount, currency } = req.body;
    var userID = req.body.user_id;
    var targetID = req.body.target_id;

    var productID = req.body.product_id;

    console.log(userID)
    console.log(targetID)

    var [result] =  await con.query('SELECT * FROM tbl_payment where user_id =? AND product_id = ?',[ userID , productID]);
        console.log(result.length)
    if(result.length >0){

        res.json({"result":"success"})
    //     var l = result.length; 
    // console.log(result[l-1])
    // result = result[l-1]
    // function isWithinLast24Hours(timestamp) {
      
    //     const date = new Date(timestamp);
      
    //     // Get the current date and time
    //     const currentDate = new Date();
      
    //     // Calculate the time difference in milliseconds
    //     const timeDifference = currentDate - date;
      
    //     // Define the number of milliseconds in 24 hours
    //     const millisecondsIn24Hours = 24 * 60 * 60 * 1000;
      
    //     // Check if the time difference is less than or equal to 24 hours
    //     return timeDifference <= millisecondsIn24Hours;
    //   }
      //var isPaid = isWithinLast24Hours(result.timestamp);  

    }else{
        res.json({"result":result})

    }   
    
      

}






    











export {register,  Login, Logout, ForgotPassword , resetpassword,
    getProducts,prodcutDetails,fvtList, addtoFVT, addtocol, colList, 
    removeFromCol, updloadBYUser, profile, profilePost, similarColl,
     aboutUs, TC_User, UserPrivacy, contactUS, aboutUs1, createPayment, 
     successPayment, cancelPayment ,paymentStatus, obtainToken, updateProfile ,
     updatePreference, addProperty, property, Properties , myProperties , 
     updateProperty , deleteProperty , addtestUser , logintestUser , addToInterest , getQuestions,
     addAnswer , removeAccount , propTypes

}


         