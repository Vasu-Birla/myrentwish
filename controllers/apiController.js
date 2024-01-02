
import { sendTokenAdmin, sendTokenUser , sendTokenUser1 } from '../utils/jwtToken.js';
import connection from '../config.js';

const con = await connection();
import * as path from 'path';

import fs from 'fs';
import upload from '../middleware/upload.js';
import paypal from 'paypal-rest-sdk';
import { parse, format } from 'date-fns';

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import puppeteer from 'puppeteer';

import { sendPushNotification , sendAgreement , sendAgreementToOwner } from '../middleware/helper.js';



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





//-----------agreement section start ---------------






const createPDFWithSignatureField = async (req, res, next) => {
  let returnedData = {
    message: 'Unexpected error',
    data: {},
    error: {},
  };

  const con = await connection();

  try {
    await con.beginTransaction();

    const { agreementtext, owner_id, tenant_id, signature, start_date, end_date, template_num, prop_id } = req.body;

    var landlordSignature = signature;

    const [tenantQuery] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [tenant_id]);
    const [ownerQuery] = await con.query('SELECT * FROM tbl_users WHERE user_id = ?', [owner_id]);
    const [propQuery] = await con.query('SELECT * FROM tbl_prop WHERE prop_id = ?', [prop_id]);

    if (!propQuery || propQuery.length == 0) {
      returnedData = { result: 'failed', message: 'Property Not Found', data: {}, error: {} };
      return res.json(returnedData);
    }

    const tenantEmail = tenantQuery[0].user_email;
    const ownerEmail = ownerQuery[0].user_email;
    const tenant = tenantQuery[0].firstname + ' ' + tenantQuery[0].lastname;
    const owner = ownerQuery[0].firstname + ' ' + ownerQuery[0].lastname;
    const propName = propQuery[0].title;
    const monthly_amount = propQuery[0].rent_amount;
    const currency = propQuery[0].currency;
    const propAddress = propQuery[0].address + ', ' + propQuery[0].city + ',' + propQuery[0].country;

    const agreementNumber = generateAgreementNumber();
    var currentDate = new Date().toISOString().split('T')[0];

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
    
        <p> Thank you for your interest in renting the Property :  <strong> ${propName} </strong> which is located at ${propAddress}.
        Agreement will be applied from <strong> ${start_date} to ${end_date} </strong> . Please review and sign below to confirm your agreement
        with the terms and conditions in this House Rental Lease Agreement. Signature by both parties
        identified in this House Rental Lease Agreement will bind them to a legally enforceable contract
        so make sure to consult with a lawyer before signing if you want to do so. </p>
    
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
          
            <p>Date : ${currentDate}</p>
            <p>Landlord Signature</p>
            <img src="${landlordSignature}" alt="Landlord's Signature">
          </div>
          <div class="tenant-signature">
            <p>Date : </p>
            <p>Tenant Signature Pending </p>
            <img class="sign-gif" src="http://${process.env.Host1}/images/signature.gif" alt="Sign GIF">
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
            margin: 0.5in;
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
        <h1>HOUSE RENTAL LEASE AGREEMENT</h1>
    
        <div class="section">
        <p class="highlight">Agreement Number: ${agreementNumber}</p>
      </div>
    
        <p> Thank you for your interest in renting the Property :  <strong> ${propName} </strong> which is located at ${propAddress}.
        Agreement will be applied from <strong> ${start_date} to ${end_date} </strong> . Please review and sign below to confirm your agreement
        with the terms and conditions in this House Rental Lease Agreement. Signature by both parties
        identified in this House Rental Lease Agreement will bind them to a legally enforceable contract
        so make sure to consult with a lawyer before signing if you want to do so. </p>
    
       
        <p class="additional-terms">${agreementtext}</p>
    
        <div class="terms">
          <h2>Terms and Conditions</h2>
    
          <p><strong>1. Agreement to rent :</strong> 
          
          <strong> ${owner} </strong> (“Owner”) agrees to rent the house located
          at <strong> ${propName} </strong> to <strong> ${tenant} </strong> (“Renter”) for the term of
          this House Rental Lease Agreement.</p>
    
          <p><strong>2. Property Maintenance:</strong> The tenant is responsible for keeping the property clean and reporting any damages promptly to the landlord.</p>
    
          <p><strong>3. Term of lease :</strong> The rental term will start on <strong> ${start_date} </strong> and end on <strong> ${end_date} </strong>.</p>
    
          <p><strong>4. Rent :</strong> Renter agrees to pay <strong> ${currency}. ${monthly_amount} </strong> in exchange for use of the House under the conditions of
          this House Rental Lease Agreement, payable as follows: [RENT PAYMENT DUE SCHEDULE].
          Payments will be made by any PAYMENT METHOD provided by landlord to [RENT PAYEE] on or before the due
          date(s) set forth above. Late payments will result in [LATE PAYMENT CONSEQUENCE];
          returned checks will result in[RETURNED CHECK CONSEQUENCE.] </p>
    
          <!-- Add more terms and conditions as needed -->
    
        </div>
    
        <div class="signature">
        <p>Date : ${currentDate}</p>
          <p>Landlord's Signature</p>
          <img src="${landlordSignature}" alt="Landlord's Signature">
        </div>
    
        <div class="signature">
        <p>Date : ${currentDate}</p>
          <p>Tenant's Signature Pending </p>
           
          <img class="sign-gif" src="http://${process.env.Host1}/images/signature.gif" alt="Sign GIF">
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
    
        <p> Thank you for your interest in renting the Property :  <strong> ${propName} </strong> which is located at ${propAddress}.
        Agreement will be applied from <strong> ${start_date} to ${end_date} </strong> . Please review and sign below to confirm your agreement
        with the terms and conditions in this House Rental Lease Agreement. Signature by both parties
        identified in this House Rental Lease Agreement will bind them to a legally enforceable contract
        so make sure to consult with a lawyer before signing if you want to do so. </p>
    
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
          <p>LANDLORD:<br>${owner} <br>Date: ${currentDate}</p>
          <img src="${landlordSignature}" alt="Landlord's Signature">
          <p>TENANT:<br>${tenant} <br>Date: Pending </p>
          Pending <img class="sign-gif" src="http://${process.env.Host1}/images/signature.gif" alt="Sign GIF">
        </div>
    
        <div class="witness">
          <p>WITNESS:<br>[Witness's Name] <br>Date: [Date]</p>
        </div>
    
        <h2 class="additional-terms">5. ADDITIONAL TERMS:</h2>
        <p class="additional-terms">${agreementtext}</p>
    
        <p>This Agreement is governed by the laws of [Your Jurisdiction]. Any disputes arising under or in connection with this Agreement shall be resolved through arbitration in accordance with the rules of the [Arbitration Institution].</p>
    
        <p>IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.</p>
    
        <div class="signature">
        
     
          <p> <br> <img src="${landlordSignature}" alt="Landlord's Signature"> <br> __________________________<br>${owner}<br>Landlord</p>
          
             
          <p> <br> <img class="sign-gif" src="http://${process.env.Host1}/images/signature.gif" alt="Sign GIF"> <br> __________________________<br>${tenant}<br>Tenant</p>
         
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

    await page.setContent(agreementData);

    const pdfBuffer = await page.pdf();

    await browser.close();

    const pdfFileName = `${agreementNumber}.pdf`;
    const filePath = path.join('public', 'agreements', pdfFileName);
    fs.writeFileSync(filePath, pdfBuffer);

    const insertQuery = 'INSERT INTO tbl_rentagreements (agreement_number, owner_id, tenant_id, prop_id, ownersigndata, monthly_amount, start_date, end_date, template_num, currency, agreementtext) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    await con.query(insertQuery, [agreementNumber, owner_id, tenant_id, prop_id, landlordSignature, monthly_amount, start_date, end_date, template_num, currency, agreementtext]);

    await sendAgreement(agreementNumber, tenantEmail, pdfBuffer, {
      agreement: agreementData,
      owner: owner,
      tenant: tenant,
    });

    await sendAgreementToOwner(ownerEmail, agreementNumber, {
      agreement: agreementData,
      owner: owner,
      tenant: tenant,
    });

    await con.commit();

    returnedData = { message: 'Rent Agreement Document Has Been Sent', data: {}, error: {} };
    res.json(returnedData);
  } catch (error) {
    await con.rollback();
    console.error('Error creating PDF:', error);
    returnedData = { message: 'Internal Server Error', data: {}, error:error.message };
    res.status(500).json(returnedData);
  }
};

// Function to convert a base64-encoded data URL to a buffer
const convertDataUrlToBuffer = (dataUrl) => {
  const base64Data = dataUrl.split(';base64,').pop();
  return Buffer.from(base64Data, 'base64');
};



function generateAgreementNumber() {
  const timestamp = new Date().getTime();
  const randomSuffix = Math.floor(Math.random() * 10000); 
  return `AG-${timestamp}-${randomSuffix}`;
}



//===================Break Point for Duplicate APIS  =============================================





export {register,  Login, Logout, ForgotPassword , resetpassword,
    profile,  obtainToken, updateProfile ,
     updatePreference, addProperty, property, Properties , myProperties , 
     updateProperty , deleteProperty , addToInterest , getQuestions,
     addAnswer , removeAccount , propTypes , getSkills , contactUs , myTickets ,tandc , pandp , faqs,
     checkPreferenceAvailability  ,  createPDFWithSignatureField ,



     getSkills1
}


         