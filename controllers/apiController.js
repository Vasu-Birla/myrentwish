
import { sendTokenAdmin, sendTokenUser , sendTokenUser1 } from '../utils/jwtToken.js';
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
import { type } from 'os';

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
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

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
      returnedData.message = 'Email already exists';
      return res.status(409).json(returnedData);
    } else {
      const sql =
        'INSERT INTO `tbl_users` ( firstname, lastname, user_email,  password, user_mobile, birthday, location, latitude, longitude, address, country, city, gender, image, imagePath, prefered_gender, prefered_city, prefered_country, bedroom_nums, bathroom_type, parking_type,prefered_type, prefered_rent, about_me, skill) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

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
        '',
        image,
        imagePath,
      ];

      const [results] = await con.query(sql, values);

      await con.commit();

      const selectUserSql = 'SELECT * FROM `tbl_users` WHERE user_id = ?';
      var [[userDetails]] = await con.query(selectUserSql, [results.insertId]);

      // userDetails.user_id = userDetails.user_id.toString();
      returnedData.message = 'Registration successful';
      returnedData.data = userDetails;
      console.log(userDetails);
      res.json(returnedData);
    }
  } catch (error) {
    await con.rollback();
    console.error('Error in register API:', error);
    returnedData.error = error.message || 'Internal Server Error';
    res.status(500).json(returnedData);
  } finally {
    con.release(); // Close the database connection
  }
};


//----------------  Register API End --------------------------


const Login = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    await con.beginTransaction();

    const { user_email, password } = req.body;

    // If the user doesn't enter email or password
    if (!user_email || !password) {
      returnedData.message = 'Please Enter Email and Password';
      res.status(204).json(returnedData);
      return;
    }

    const [results] = await con.query('SELECT * FROM tbl_users WHERE user_email = ?', [user_email]);
    const user = results[0];

    if (!user) {
      returnedData.message = 'Account does not exist!';
      res.status(404).json(returnedData);
      return;
    }

    let isValid = comparePassword(password, user.password);

    if (!isValid) {
      returnedData.message = 'Incorrect Password';
      res.status(401).json(returnedData);
      return;
    }

    if (user.status === 'active') {
      sendTokenUser1(user, 200, res);
      await con.commit();
    } else {
      returnedData.message = 'Your Account Has Been Deactivated!';
      res.status(403).json(returnedData);
    }
  } catch (error) {
    await con.rollback();
    console.error('Error in Login API:', error);
    returnedData.error = error.message || 'Internal Server Error';
    res.status(500).json(returnedData);
  } finally {
    con.release();
  }
};
 
  

const Logout = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  try {
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    returnedData.message = 'Logout success';
    res.status(200).json(returnedData);
  } catch (error) {
    console.error('Error in Logout API:', error);
    returnedData.error = error.message || 'Unexpected error';
    res.status(500).json(returnedData);
  }
};


//---------------------- Login /Logout API end -------------------------------


//---------------------- Forgot Password start  -------------------------------





const ForgotPassword = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    const { user_email } = req.body;
    var email = user_email;

    let otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);
    console.log(otp);

    if (!email) {
      returnedData.message = 'Email Required';
      res.status(204).json(returnedData);
    } else {
      const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_email = ?', [email]);

      if (!user) {
        returnedData.message = 'Invalid Email';
        res.status(400).json(returnedData);
      } else {
        sendMailOTP(email, otp, user);
        returnedData.message = 'success';
        returnedData.data = { user_id: user.user_id, otp: otp };
        res.status(200).json(returnedData);
      }
    }
  } catch (error) {
    console.error('Error in ForgotPassword API:', error);
    returnedData.error = error.message || 'Internal Server Error';
    res.status(500).json(returnedData);
  } finally {
    con.release();
  }
};


//---------------------- Forgot Password End  -------------------------------


//============== Reset Password with the OTP sent from previous post Method  ------------




const resetpassword = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    await con.beginTransaction();
    const userID = req.body.user_id;
    const newPassword = hashPassword(req.body.confirmPass);

    console.log(newPassword);

    const [results] = await con.query('UPDATE tbl_users SET password = ? WHERE user_id = ?', [
      newPassword,
      userID,
    ]);
    await con.commit();
    returnedData.message = 'success';
    res.json(returnedData);

  } catch (error) {
    await con.rollback();
    console.error('Error in resetPassword API:', error);
    returnedData.error = error.message || 'Internal Server Error';
    res.status(500).json(returnedData);

  } finally {
    con.release();
  }
};



//------------ delete User -------------- 


const removeAccount = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();
  const userID = req.body.user_id;

  try {
    await con.beginTransaction();

    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);

    if (user.status == 'inactive') {
      returnedData.message = 'Deactivated Profile Cannot be deleted';
      return res.status(401).json(returnedData);
    }

    await con.query('DELETE FROM tbl_users WHERE user_id = ?', [userID]);

    await con.commit();
    returnedData.message = 'Your Account has been deleted!';
    res.json(returnedData);

  } catch (error) {
    await con.rollback();
    console.error('Error in removeAccount API:', error);
    returnedData.error = error.message || 'Internal Server Error';
    returnedData.message = 'Unable to delete Your Account!';
    res.status(500).json(returnedData);

  } finally {
    con.release();
  }
};








//======================= Profile Section Start  ===============================




const profile = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    const userID = req.body.user_id;
    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);

    if (user && user.status === 'active') {
      returnedData.message = 'success';
      returnedData.data = user;
      res.json(returnedData);
    } else {
      returnedData.message = "Deactivated User's Profile cannot be Open";
      res.json(returnedData);
    }
  } catch (error) {
    console.error('Error in profile API:', error);
    returnedData.error = error.message || 'Internal Server Error';
    res.status(500).json(returnedData);
  } finally {
    con.release();
  }
};






const updateProfile = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    await con.beginTransaction();

    const userID = req.body.user_id;

    // Fetch the existing user details
    const [[existingUser]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);

    if (!existingUser) {
      await con.rollback();
      returnedData.message = 'User not found';
      res.status(404).json(returnedData);
      return;
    }

    var image = existingUser.image;
    var imagePath = existingUser.imagePath;

    if (req.file) {
      console.log('New image found...');
      image = req.file.filename;
      imagePath = req.file.path = `http://${process.env.Host1}/uploads/${req.file.filename}`;
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
      imagePath: imagePath,
    };

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

    returnedData.message = 'success';
    res.json(returnedData);

  } catch (error) {
    // Rollback the transaction in case of an error
    await con.rollback();
    console.error('Error in updateProfile API:', error);
    returnedData.error = error.message || 'Internal Server Error';
    res.status(500).json(returnedData);

  } finally {
    con.release();
  }
};


  //------------------ Update Preference ---------------------



const updatePreference = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    await con.beginTransaction();
    const userID = req.body.user_id;

    // Fetch the existing user details
    const [[existingUser]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);

    if (!existingUser) {
      await con.rollback();
      returnedData.message = 'User not found';
      res.status(404).json(returnedData);
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
      prefered_type: req.body.prefered_type || existingUser.prefered_type,
      prefered_rent: req.body.prefered_rent || existingUser.prefered_rent,
      about_me: req.body.about_me || existingUser.about_me,
      skill: req.body.skill || existingUser.skill,
    };

    // Update the user preferences in the database
    const updateSql =
      'UPDATE tbl_users SET prefered_gender=?, prefered_city=?, prefered_country=?, bedroom_nums=?, bathroom_type=?, parking_type=?, prefered_type=?, prefered_rent=?, about_me=?, skill=? WHERE user_id=?';
    const updateValues = [
      updatedPreferences.prefered_gender,
      updatedPreferences.prefered_city,
      updatedPreferences.prefered_country,
      updatedPreferences.bedroom_nums,
      updatedPreferences.bathroom_type,
      updatedPreferences.parking_type,
      updatedPreferences.prefered_type,
      updatedPreferences.prefered_rent,
      updatedPreferences.about_me,
      updatedPreferences.skill,
      userID,
    ];

    await con.query(updateSql, updateValues);
    await con.commit();
    returnedData.message = 'success';
    res.json(returnedData);

  } catch (error) {
    // Rollback the transaction in case of an error
    await con.rollback();
    console.error('Error in updatePreference API:', error);
    returnedData.error = error.message || 'Internal Server Error';
    res.status(500).json(returnedData);

  } finally {
    if (con) {
      con.release();
    }
  }
};





//----------- check that User Updated Prefrence even once or not --- 



const checkPreferenceAvailability = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    const userID = req.body.user_id;

    // Check if the user has ever updated preferences
    const [[existingUser]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);

    if (!existingUser) {
      returnedData.message = 'User not found';
      res.status(404).json(returnedData);
      return;
    }

    const hasUpdatedPreferences =
      existingUser.prefered_gender !== null && existingUser.prefered_gender.trim() !== '' ||
      existingUser.prefered_city !== null && existingUser.prefered_city.trim() !== '' ||
      existingUser.prefered_country !== null && existingUser.prefered_country.trim() !== '' ||
      existingUser.bedroom_nums !== null && existingUser.bedroom_nums.trim() !== '' ||
      existingUser.bathroom_type !== null && existingUser.bathroom_type.trim() !== '' ||
      existingUser.parking_type !== null && existingUser.parking_type.trim() !== '' ||
      existingUser.prefered_type !== null && existingUser.prefered_type.trim() !== '' ||
      existingUser.prefered_rent !== null && existingUser.prefered_rent.trim() !== '' ||
      existingUser.about_me !== null && existingUser.about_me.trim() !== '' ||
      existingUser.skill !== null && existingUser.skill.trim() !== '';

    if (hasUpdatedPreferences) {
      returnedData.message = 'success';
      res.json(returnedData);
    } else {
      returnedData.message = 'failed';
      res.status(500).json(returnedData);
    }

  } catch (error) {
    console.error('Error in checkPreferenceUpdate API:', error);
    returnedData.error = error.message || 'Internal Server Error';
    res.status(500).json(returnedData);

  } finally {
    if (con) {
      con.release();
    }
  }
};




//====================================== Property Section Start ==================================== 



//--------- Add Property by User -------------------------- 




const addProperty = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    await con.beginTransaction();

    const userID = req.body.user_id;

    // Validate if the user exists
    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
    if (!user) {
      await con.rollback();
      returnedData.message = 'User not found';
      res.status(404).json(returnedData);
      return;
    }

    // Extract property details from the request body
    const {
      owner_name,
      owner_contact,
      owner_email,
      title,
      prefered_gender,
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
      currency,
      available_date,
      prop_status, // Assuming this is part of the request body
    } = req.body;

    // Set is_available based on prop_status
    const is_available = prop_status === 'available';

    const images = req.files.map(file => ({ path: `http://${process.env.Host1}/uploads/${file.filename}` }));

    // Insert property details into the tbl_prop table
    const insertSql =
      'INSERT INTO tbl_prop (user_id, owner_name, owner_contact, owner_email, title,prefered_gender, description, address, city, country, prop_type, bedroom_nums, bathroom_type, parking_type, size_sqft, rent_amount, currency, available_date, is_available, prop_status, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const insertValues = [
      userID,
      owner_name,
      owner_contact,
      owner_email,
      title,
      prefered_gender,
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
      currency,
      available_date,
      is_available,
      prop_status,
      JSON.stringify(images),
    ];

    const [results] = await con.query(insertSql, insertValues);

    const selectPropertySql = 'SELECT * FROM `tbl_prop` WHERE prop_id = ?';
    var [[propertyDetails]] = await con.query(selectPropertySql, [results.insertId]);

    propertyDetails.images = JSON.parse(propertyDetails.images);
    propertyDetails.available_date = format(new Date(propertyDetails.available_date), 'yyyy-MM-dd');

    await con.commit();
    returnedData.message = 'success';
    res.json(returnedData);

  } catch (error) {
    // Rollback the transaction in case of an error
    await con.rollback();
    console.error('Error in addProperty API:', error);
    returnedData.error = error.message || 'Internal Server Error';
    res.status(500).json(returnedData);

  } finally {
    if (con) {
      con.release();
    }
  }
};








//---------- fetch Properties -------


const Properties = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    const userID = req.body.user_id;

    // Validate if the user exists
    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
    if (!user) {
      returnedData.message = 'User not found';
      res.status(404).json(returnedData);
      return;
    }

    const page = req.body.page_number || 1; // Default to page 1 if not provided
    const resultsPerPage = 5;
    const offset = (page - 1) * resultsPerPage;

    // Fetch total number of properties for pagination calculation
    const [totalPropsResult] = await con.query('SELECT COUNT(*) as total FROM tbl_prop');
    const totalProperties = totalPropsResult[0].total;

    const selectPropertiesSql = 'SELECT * FROM `tbl_prop` WHERE user_id != ? LIMIT ? OFFSET ?';
    const [properties] = await con.query(selectPropertiesSql, [userID, resultsPerPage, offset]);

    for (const row of properties) {
      row.images = JSON.parse(row.images);
      row.available_date = format(new Date(row.available_date), 'yyyy-MM-dd');

      // Check if the property is in the user's interest
      const [interestResult] = await con.query('SELECT * FROM tbl_interest WHERE user_id = ? AND prop_id = ?', [userID, row.prop_id]);

      row.interest = (interestResult.length > 0).toString();

      // Calculate match percentage
      const matchPercentage = calculatePreferencesMatchPercentage(user, row);
      row.match_percentage = `${matchPercentage}%`;

      console.log("type--percent -> ", typeof row.match_percentage);

      var [[owner]] = await con.query('SELECT * from tbl_users where user_id = ? ', [row.user_id]);

      row.owner_image = owner.imagePath;
    }

    properties.sort((a, b) => {
      const matchPercentageA = parseFloat(a.match_percentage);
      const matchPercentageB = parseFloat(b.match_percentage);

      // If match percentages are equal, compare by decimal values
      if (matchPercentageA === matchPercentageB) {
        const decimalA = parseFloat(a.match_percentage.split('.')[1]) || 0;
        const decimalB = parseFloat(b.match_percentage.split('.')[1]) || 0;
        return decimalB - decimalA;
      }

      return matchPercentageB - matchPercentageA;
    });

    returnedData.message = 'success';
    returnedData.data = properties;
    res.json(returnedData);

  } catch (error) {
    console.error('Error in fetchAllProperties API:', error);
    returnedData.error = error.message || 'Internal Server Error';
    res.status(404).json(returnedData);
  } finally {
    if (con) {
      con.release();
    }
  }
};




// Function to calculate match percentage based on preferences
const calculatePreferencesMatchPercentage = (userPreferences, propertyDetails) => {
  // Define weights for each preference (adjust these according to importance)
  const weightGender = 10;
  const weightCity = 8;
  const weightCountry = 7;
  const weightBedrooms = 5;
  const weightBathroomType = 5;
  const weightParkingType = 5;
  const weightPreferredType = 6;
  const weightPreferredRent = 14;

  // Initialize match percentageṁ
  let matchPercentage = 0;

  // Check each preference and increase matchPercentage accordingly
  if (userPreferences.gender == propertyDetails.prefered_gender) {
    matchPercentage += weightGender;
  }

  if (userPreferences.prefered_city == propertyDetails.city) {
    matchPercentage += weightCity;
  }

  if (userPreferences.prefered_country == propertyDetails.country) {
    matchPercentage += weightCountry;
  }

  if (userPreferences.bedroom_nums == propertyDetails.bedroom_nums) {
    matchPercentage += weightBedrooms;
  }

  if (userPreferences.bathroom_type == propertyDetails.bathroom_type) {
    matchPercentage += weightBathroomType;
  }

  if (userPreferences.parking_type == propertyDetails.parking_type) {
    matchPercentage += weightParkingType;
  }

  if (userPreferences.prefered_type == propertyDetails.prop_type) {
    matchPercentage += weightPreferredType;
  }

  // Calculate match percentage based on rent difference
  const rentDifference = Math.abs(userPreferences.prefered_rent - propertyDetails.rent_amount);
  const maxRentDifference = 1000; // Adjust this value based on your criteria
  const rentMatch = Math.max(0, maxRentDifference - rentDifference) / maxRentDifference * weightPreferredRent;
  matchPercentage += rentMatch;

  console.log(typeof matchPercentage )

  return parseInt(matchPercentage);
};











//-------- fetch my properties -------


const myProperties = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    await con.beginTransaction();
    const userID = req.body.user_id;

    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
    if (!user) {
      await con.rollback();
      returnedData.message = 'User not found';
      res.status(404).json(returnedData);
      return;
    }

    const selectPropertiesSql = 'SELECT * FROM `tbl_prop` WHERE user_id = ?';
    const [properties] = await con.query(selectPropertiesSql, [userID]);

    for (const row of properties) {
      row.images = JSON.parse(row.images);
      row.available_date = format(new Date(row.available_date), 'yyyy-MM-dd');
    }

    await con.commit();
    returnedData.message = 'success';
    returnedData.data = properties;
    res.json(returnedData);
  } catch (error) {
    // Rollback the transaction in case of an error
    await con.rollback();
    console.error('Error in myProperties API:', error);
    returnedData.error = error.message || 'Internal Server Error';
    res.status(500).json(returnedData);
  } finally {
    if (con) {
      con.release();
    }
  }
};


  //-------------fetch single Property ----- 

  const property = async (req, res, next) => {
    let returnedData = {
      message: 'Unexpected error',
      data: {},
      error: {},
    };
  
    const con = await connection();
  
    try {
      const prop_id = req.body.prop_id;
      const [[property]] = await con.query('SELECT * FROM tbl_prop WHERE prop_id = ?', [prop_id]);
  
      if (!property) {
        returnedData.message = 'Property Not Found';
        res.status(404).json(returnedData);
        return;
      }
  
      property.images = JSON.parse(property.images);
      property.available_date = format(new Date(property.available_date), 'yyyy-MM-dd');
  
      returnedData.message = 'success';
      returnedData.data = property;
      res.json(returnedData);
  
    } catch (error) {
      console.error('Error in property API:', error);
      returnedData.error = error.message || 'Internal Server Error';
      res.status(500).json(returnedData);
    } finally {
      if (con) {
        con.release();
      }
    }
  };


  //------------- Update Property --------------------- 


const updateProperty = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    await con.beginTransaction();

    const userID = req.body.user_id;
    const propertyID = req.body.prop_id;

    // Validate if the user exists
    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
    if (!user) {
      await con.rollback();
      returnedData.message = 'User not found';
      res.status(404).json(returnedData);
      return;
    }

    // Validate if the property exists and is owned by the user
    const [[property]] = await con.query('SELECT * FROM `tbl_prop` WHERE prop_id = ? AND user_id = ?', [propertyID, userID]);
    if (!property) {
      await con.rollback();
      returnedData.message = 'Property not found or does not belong to the user';
      res.json(returnedData);
      return;
    }

    let images;

    if (req.files && req.files.length > 0) {
      console.log('New Images uploaded');
      images = req.files.map(file => ({ path: `http://${process.env.Host1}/uploads/${file.filename}` }));
    } else {
      console.log('Existing Images uploaded');
      images = JSON.parse(property.images);
    }

    const updatedPropertyDetails = {
      owner_name: req.body.owner_name || property.owner_name,
      owner_contact: req.body.owner_contact || property.owner_contact,
      owner_email: req.body.owner_email || property.owner_email,
      title: req.body.title || property.title,
      description: req.body.description || property.description,
      address: req.body.address || property.address,
      city: req.body.city || property.city,
      country: req.body.country || property.country,
      prop_type: req.body.prop_type || property.prop_type,
      bedroom_nums: req.body.bedroom_nums || property.bedroom_nums,
      bathroom_type: req.body.bathroom_type || property.bathroom_type,
      parking_type: req.body.parking_type || property.parking_type,
      size_sqft: req.body.size_sqft || property.size_sqft,
      rent_amount: req.body.rent_amount || property.rent_amount,
      currency: req.body.currency || property.currency,
      available_date: req.body.available_date || property.available_date,
      prop_status: req.body.prop_status || property.prop_status,
      is_available: req.body.prop_status === 'available',
      images: JSON.stringify(images),
    };

    const updateSql =
      'UPDATE tbl_prop SET owner_name=?, owner_contact=?, owner_email=?, title=?, description=?, address=?, city=?, country=?, prop_type=?, bedroom_nums=?, bathroom_type=?, parking_type=?, size_sqft=?, rent_amount=?, currency=?, available_date=?, is_available=?, prop_status=?, images=? WHERE prop_id=?';

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
      updatedPropertyDetails.currency,
      updatedPropertyDetails.available_date,
      updatedPropertyDetails.is_available,
      updatedPropertyDetails.prop_status,
      updatedPropertyDetails.images,
      propertyID,
    ];

    await con.query(updateSql, updateValues);

    const selectUpdatedPropertySql = 'SELECT * FROM `tbl_prop` WHERE prop_id = ?';
    const [[finalUpdatedPropertyDetails]] = await con.query(selectUpdatedPropertySql, [propertyID]);

    finalUpdatedPropertyDetails.images = JSON.parse(finalUpdatedPropertyDetails.images);
    finalUpdatedPropertyDetails.available_date = format(new Date(finalUpdatedPropertyDetails.available_date), 'yyyy-MM-dd');

    console.log('Property updated successfully ->> ', finalUpdatedPropertyDetails);

    await con.commit();
    returnedData.message = 'success';
    returnedData.data = finalUpdatedPropertyDetails;
    res.json(returnedData);
  } catch (error) {
    await con.rollback();
    console.error('Error in updateProperty API:', error);
    returnedData.error = error.message || 'Internal Server Error';
    res.status(500).json(returnedData);
  } finally {
    if (con) {
      con.release();
    }
  }
};





//--------  Delete Property ---------------


const deleteProperty = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    await con.beginTransaction();

    const userID = req.body.user_id;
    const propertyID = req.body.prop_id;

    // Validate if the user exists
    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [userID]);
    if (!user) {
      await con.rollback();
      returnedData.message = 'User not found';
      res.status(404).json(returnedData);
      return;
    }

    // Validate if the property exists and is owned by the user
    const [[property]] = await con.query('SELECT * FROM `tbl_prop` WHERE prop_id = ? AND user_id = ?', [propertyID, userID]);
    if (!property) {
      await con.rollback();
      returnedData.message = 'Property not found or does not belong to the user';
      res.status(404).json(returnedData);
      return;
    }

    // Delete the property from the tbl_prop table
    const deleteSql = 'DELETE FROM tbl_prop WHERE prop_id = ?';
    await con.query(deleteSql, [propertyID]);

    await con.commit();
    console.log('Property Deleted Successfully');
    returnedData.message = 'Success';
    returnedData.data = { result: 'success', message: 'Property deleted successfully' };
    res.json(returnedData);

  } catch (error) {
    // Rollback the transaction in case of an error
    await con.rollback();
    console.error('Error in delete Property API:', error);
    returnedData.error = error.message || 'Internal Server Error';
    res.status(500).json(returnedData);

  } finally {
    if (con) {
      con.release();
    }
  }
};




//-------------------- get property types ---------- 



const propTypes = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    const selectSql = 'SELECT * FROM tbl_proptype';
    const [propTypes] = await con.query(selectSql);

    returnedData.message = 'success';
    returnedData.data = propTypes;
    res.json(returnedData);

  } catch (error) {
    console.error('Error in getQuestions API:', error);
    returnedData.error = error.message || 'Internal Server Error';
    res.status(500).json(returnedData);

  } finally {
    if (con) {
      con.release();
    }
  }
};



const getSkills1 = async (req, res, next) => {
  const con = await connection();

  try {

   
    const selectSql = 'SELECT * FROM tbl_skills';
    const [skills] = await con.query(selectSql);  

    res.json( skills );

  } catch (error) {
    console.error('Error in getskills :', error);
    res.status(404).json({ result: 'failed' , message:'Internal Server Error' });

  } finally {
    if (con) {
      con.release();
    }
  }
};




const getSkills = async (req, res, next) => {


        let returnedData = {
          message: 'Unexpected error',
          data: {},
          error: {},
        };

  try {
    const con = await connection();
   
    const selectSql = 'SELECT * FROM tbl_skills';
    const [skills] = await con.query(selectSql);

    returnedData.message = 'Skills retrieved successfully';
    returnedData.data = skills;

    res.setHeader('Content-Type', 'application/json');
    res.json(returnedData);

  } catch (error) {
    console.error('Error in getSkills:', error);
    returnedData.error = error.message || 'Internal Server Error';
    res.status(404).json(returnedData);

  } finally {   
      con.release();    
  }
};






//----------- add to interest ------------- 

const addToInterest = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

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
      returnedData.error = 'User or Property not found';
      return res.status(404).json(returnedData);
    }

    // Check if the user is already interested in the property
    const [existingInterest] = await con.query('SELECT * FROM tbl_interest WHERE user_id = ? AND prop_id = ?', [userID, propertyID]);

    if (existingInterest.length > 0) {
      await con.rollback();
      returnedData.message = 'User is already interested in this property';
      return res.status(200).json(returnedData);
    }

    // Retrieve the owner's user_id from the tbl_prop table
    const [ownerResult] = await con.query('SELECT user_id FROM tbl_prop WHERE prop_id = ?', [propertyID]);

    if (!ownerResult[0]) {
      await con.rollback();
      returnedData.error = 'Owner not found for this property';
      return res.status(404).json(returnedData);
    }

    const ownerID = ownerResult[0].user_id;

    // Add the interest to tbl_interest table
    const insertSql = 'INSERT INTO tbl_interest (user_id, prop_id) VALUES (?, ?)';
    await con.query(insertSql, [userID, propertyID]);

    // Insert notification into tbl_notifications
    const notificationSql = 'INSERT INTO tbl_notifications (user_id, owner_id, property_id, title, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())';
    const notificationTitle = 'New Interest';
    const notificationMessage = `User ${userResult[0].firstname} is interested in your property ${propertyResult[0].title}`;
    await con.query(notificationSql, [userID, ownerID, propertyID, notificationTitle, notificationMessage]);

    await con.commit();
    returnedData.message = 'Added to interest list successfully';
    res.json(returnedData);

  } catch (error) {
    // Rollback the transaction in case of an error
    await con.rollback();
    console.error('Error in addToInterest API:', error);
    returnedData.error = error.message || 'Internal Server Error';
    res.status(500).json(returnedData);

  } finally {
    if (con) {
      con.release();
    }
  }
};





//=================================== Questions  section ====================================== 


const getQuestions = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

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
    const formattedQuestions = questions.map((question, index) => {
      question.answer_options = JSON.parse(question.answer_options);
      question.answer = userAnswersMap[question.question_id] || ''; // Set user answer or empty string
      question.question_num = (offset + index + 1).toString();
      return question;
    });

    totalPages = totalPages.toString();

    returnedData = {
      message: 'Questions retrieved successfully',
      data: {
        totalPages,
        questions: formattedQuestions,
      },
      error: {},
    };

    res.json(returnedData);

  } catch (error) {
    console.error('Error in getQuestions API:', error);
    returnedData.error = error;
    res.status(500).json(returnedData);
  } finally {
    if (con) {
      con.release();
    }
  }
};





//--------- for multipule answer -----------------------  


const addAnswer = async (req, res, next) => {
  console.log("req.body -->>>", req.body);
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    await con.beginTransaction();

    var { user_id, answers } = req.body;

    answers = JSON.parse(answers);
    answers.forEach(answer => {
      const parsedQuestionId = parseInt(answer.question_id, 10);
      console.log(`Original question_id: ${answer.question_id}, Parsed question_id: ${parsedQuestionId}`);
      return answer.question_id = parsedQuestionId;
    });

    console.log(answers);

    // Validate if the user exists
    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [user_id]);
    if (!user) {
      await con.rollback();
      returnedData = { message: "User not found", data: {}, error: {} };
      return res.status(404).json(returnedData);
    }

    // Fetch all questions to validate answers
    const questionIds = answers.map(answer => parseInt(answer.question_id, 10));
    const [questions] = await con.query('SELECT * FROM tbl_questions WHERE question_id IN (?)', [questionIds]);

    const questionMap = new Map(questions.map(question => [question.question_id, question]));

    // Validate answers
    const invalidAnswers = answers.filter(answer => {
      const question = questionMap.get(parseInt(answer.question_id, 10));

      console.log("question id ->> ", question);
      console.log("answer  ->> ", answer.answer);

      if (question.question_type !== 'Text') {
        return !question || !question.answer_options.includes(answer.answer);
      }
    });

    if (invalidAnswers.length > 0) {
      await con.rollback();
      returnedData = { message: "Invalid question or answer", data: { invalidAnswers }, error: {} };
      return res.status(400).json(returnedData);
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
    console.log("ans added successfully ");
    returnedData = { message: "Answers added successfully", data: {}, error: {} };
    res.json(returnedData);

  } catch (error) {
    // Rollback the transaction in case of an error
    await con.rollback();
    console.error('Error in addAnswer API:', error);
    returnedData = { message: 'Internal Server Error', data: {}, error };
    res.status(500).json(returnedData);

  } finally {
    if (con) {
      con.release();
    }
  }
};






//==============================================  NOTIFICATION SECTOIN =========================


const obtainToken = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    await con.beginTransaction();

    const userID = req.body.user_id;
    const device_token = req.body.device_token;
    const device_status = req.body.device_status;
    const timestamp = Date.now();
    const created_at = new Date(timestamp);
    const updated_at = new Date(timestamp);

    console.log("--------------------");
    console.log(device_token);
    console.log("--------------------");

    // Check if a record already exists for this user and device token
    const [existingRecords] = await con.query('SELECT * FROM tbl_fcm WHERE user_id = ? AND device_token = ?', [userID, device_token]);

    const [[existingDeviceID]] = await con.query('SELECT * FROM tbl_fcm WHERE device_token = ?', [device_token]);

    if (existingRecords.length > 0) {
      console.log("Existing DeviceID");

      const [result] = await con.query('UPDATE tbl_fcm SET device_status = ?, updated_at = ? WHERE user_id = ? AND device_token = ?', [device_status, updated_at, userID, device_token]);

      if (result) {
        returnedData = { message: "success", data: {}, error: {} };
        res.json(returnedData);
      } else {
        returnedData = { message: "failed", data: {}, error: {} };
        res.status(500).json(returnedData);
      }
    } else {
      console.log("New DeviceID");

      if (existingDeviceID) {
        console.log("Duplicate Device Found & Set for Current User Successfully");

        await con.query('DELETE FROM tbl_fcm WHERE user_id = ? AND device_token = ?', [existingDeviceID.user_id, device_token]);
      }

      const [result] = await con.query('INSERT INTO tbl_fcm (user_id, device_token, device_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)', [userID, device_token, device_status, created_at, updated_at]);

      if (result) {
        returnedData = { message: "success", data: {}, error: {} };
        res.json(returnedData);
      } else {
        returnedData = { message: "failed", data: {}, error: {} };
        res.status(500).json(returnedData);
      }
    }

    await con.commit();
  } catch (error) {
    await con.rollback();
    console.error('Error in obtainToken API:', error);
    returnedData = { message: 'Internal Server Error', data: {}, error };
    res.status(500).json(returnedData);
  } finally {
    if (con) {
      con.release();
    }
  }
};



//===========================  Contact US  Section  ================================ 


const contactUs = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    await con.beginTransaction();

    const { user_id, subject, email, message } = req.body;

    // Validate if the user exists
    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [user_id]);
    if (!user) {
      await con.rollback();
      returnedData = { message: 'User not found', data: {}, error: {} };
      return res.status(404).json(returnedData);
    }

    // Generate a random 4-digit number
    const random4Digits = Math.floor(1000 + Math.random() * 9000);

    // Combine user_id and random4Digits to create a complain_number
    const complain_number = `${user_id}${random4Digits}`;

    // Insert the contact query into tbl_queries
    const insertSql = 'INSERT INTO tbl_queries (user_id, subject, email, message, complain_number) VALUES (?, ?, ?, ?, ?)';
    const [result] = await con.query(insertSql, [user_id, subject, email, message, complain_number]);

    await con.commit();

    returnedData = { message: 'success', data: { complain_number }, error: {} };
    res.json(returnedData);
  } catch (error) {
    await con.rollback();
    console.error('Error in contactUs API:', error);
    returnedData = { message: 'Internal Server Error', data: {}, error };
    res.status(500).json(returnedData);
  } finally {
    if (con) {
      con.release();
    }
  }
};





const myTickets = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    const { user_id } = req.body;

    // Validate if the user exists
    const [[user]] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [user_id]);
    if (!user) {
      returnedData = { message: 'User not found', data: {}, error: {} };
      return res.status(404).json(returnedData);
    }

    // Fetch tickets for the specified user
    const [tickets] = await con.query('SELECT * FROM tbl_queries WHERE user_id = ?', [user_id]);

    returnedData = { message: 'success', data: tickets, error: {} };
    res.json(returnedData);
  } catch (error) {
    console.error('Error in myTickets API:', error);
    returnedData = { message: 'Internal Server Error', data: {}, error };
    res.status(500).json(returnedData);
  } finally {
    if (con) {
      con.release();
    }
  }
};







//======================   Terms & Condition  Webview ================== 


const tandc = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    // Fetch the terms and conditions from the database
    const [result] = await con.query('SELECT * FROM tbl_tandc where id = ?', [1]);

    if (result.length > 0) {
      const termsContent = result[0].terms;

      returnedData = { message: 'success', data: termsContent, error: {} };
      // Return the HTML content as a response
      res.send(returnedData);
    } else {
      // If terms and conditions not found, you can send an appropriate response
      returnedData = { message: 'Terms and conditions not found', data: {}, error: {} };
      res.status(404).json(returnedData);
    }
  } catch (error) {
    console.error('Error in tandc API:', error);
    returnedData = { message: 'Internal Server Error', data: {}, error };
    res.status(500).json(returnedData);
  } finally {
    con.release();
  }
};





//========================== UserPrivacy and policy webview ============== 



const pandp = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    // Fetch the privacy and policy from the database
    const [result] = await con.query('SELECT * FROM tbl_pandp where id = ?', [1]);

    if (result.length > 0) {
      const policyContent = result[0].policy;

      returnedData = { message: 'success', data: policyContent, error: {} };
      // Return the HTML content as a response
      res.send(returnedData);
    } else {
      // If privacy and policy not found, you can send an appropriate response
      returnedData = { message: 'User Privacy not found', data: {}, error: {} };
      res.status(404).json(returnedData);
    }
  } catch (error) {
    console.error('Error in pandp API:', error);
    returnedData = { message: 'Internal Server Error', data: {}, error };
    res.status(500).json(returnedData);
  } finally {
    con.release();
  }
};




//=======================  FAQ webview ========================= 




const faqs = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    // Fetch FAQs from the database
    const [results] = await con.query('SELECT * FROM tbl_faq');

    if (results.length > 0) {
      // Generate HTML for FAQs with index
      const faqHTML = results.map((result, index) => ({
        question: `Q.${index + 1}: ${result.faq}`,
        answer: result.answer,
      }));

      returnedData = { message: 'success', data: faqHTML, error: {} };
      // Return the HTML as a response
      res.json(returnedData);
    } else {
      // If no FAQs found, you can send an appropriate response
      returnedData = { message: 'No FAQs found', data: {}, error: {} };
      res.status(404).json(returnedData);
    }
  } catch (error) {
    console.error('Error in faqs API:', error);
    returnedData = { message: 'Internal Server Error', data: {}, error };
    res.status(500).json(returnedData);
  } finally {
    con.release();
  }
};







//===================Break Point for Duplicate APIS  =============================================





export {register,  Login, Logout, ForgotPassword , resetpassword,
    profile,  obtainToken, updateProfile ,
     updatePreference, addProperty, property, Properties , myProperties , 
     updateProperty , deleteProperty , addToInterest , getQuestions,
     addAnswer , removeAccount , propTypes , getSkills , contactUs , myTickets ,tandc , pandp , faqs,
     checkPreferenceAvailability  , 



     getSkills1
}


         