
import { sendTokenAdmin, sendTokenUser } from '../utils/jwtToken.js';
import connection from '../config.js';

const con = await connection();
import * as path from 'path';
import upload from '../middleware/upload.js';
import paypal from 'paypal-rest-sdk';
import { parse, format } from 'date-fns';


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




//---------- fetch Properties -------
const Properties = async (req, res, next) => {
const  con = await connection();
  try {
    await con.beginTransaction();
    const userID = req.body.user_id;

    // Validate if the user exists
    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
    if (!user) {
      await con.rollback();
      return res.json({ result: "User not found" });
    }
    //const selectPropertiesSql = 'SELECT * FROM `tbl_prop` WHERE user_id <> ?';
    const selectPropertiesSql = 'SELECT * FROM `tbl_prop` WHERE user_id != ?';
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


//------------------------ veiw/edit Single User End -------------------------




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


const obtainToken1 = async(req,res,next)=>{   

    const con = await connection(); 

    var userID = req.body.user_id;
    var device_token = req.body.device_token;
    var device_status = req.body.device_status;
    var created_at = Date.now();
    var updated_at = Date.now();
    
    const [result] =  await con.query('INSERT INTO fcm_tokens (user_id, device_token, device_status, created_at, updated_at ) VALUES (?, ?, ?, ?, ?)', [userID, device_token, device_status, created_at, updated_at]);  
 


    if(result){ 
        res.json({"result":"success"})
    }else{
        res.json({"result":"failed"})
    }
}


const obtainToken = async(req,res,next)=>{   

    const con = await connection(); 

    var userID = req.body.user_id;
    var device_token = req.body.device_token;
    var device_status = req.body.device_status;
    var created_at = Date.now();
    var updated_at = Date.now();

    // Check if a record already exists for this user and device token
 const [existingRecords] = await con.query('SELECT * FROM fcm_tokens WHERE user_id = ? AND device_token = ?', [userID, device_token]);

 
 const [[existingDeviceID]] = await con.query('SELECT * FROM fcm_tokens WHERE device_token = ?', [ device_token]);




      //&& existingDeviceID.user_id != userID  

 if (existingRecords.length > 0) {
        console.log("existing DeviceID")
    const [result] =  await con.query('UPDATE fcm_tokens SET device_status = ?, updated_at = ? WHERE user_id = ? AND device_token = ?', [device_status, updated_at, userID, device_token]);
            if(result){ 
                res.json({"result":"success"})
            }else{
                res.json({"result":"failed"})
            }

} else {
    console.log("New DeviceID")
    if(existingDeviceID){
        console.log("Duplicate Device Found & Set for Current User Successfully")
 
    await con.query('DELETE FROM fcm_tokens WHERE user_id = ? AND device_token = ?', [ existingDeviceID.user_id, device_token]);
}

    const [result] =  await con.query('INSERT INTO fcm_tokens (user_id, device_token, device_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)', [userID, device_token, device_status, created_at, updated_at]);

            if(result){ 
             
                res.json({"result":"success"})
            }else{
                res.json({"result":"failed"})
            }

    }
   // await con.query('INSERT INTO fcm_tokens (user_id, device_token, device_status, created_at, updated_at ) VALUES (?, ?, ?, ?, ?)', [userID, device_token, device_status, created_at, updated_at]);  
 


  
}
 

    











export {register,  Login, Logout, ForgotPassword , resetpassword,
    getProducts,prodcutDetails,fvtList, addtoFVT, addtocol, colList, 
    removeFromCol, updloadBYUser, profile, profilePost, similarColl,
     aboutUs, TC_User, UserPrivacy, contactUS, aboutUs1, createPayment, 
     successPayment, cancelPayment ,paymentStatus, obtainToken, updateProfile ,
     updatePreference, addProperty, property, Properties , myProperties

}


         