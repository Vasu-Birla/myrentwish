import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import connection from '../config.js';
import jsPDF from 'jspdf';

const con = await connection();

import admin from 'firebase-admin';
//import serviceAccount from '../assets/myhwfirebase.json';

// import serviceAccount from '../public/assets/myhwfirebase.json' assert { type: 'json' };

// admin.initializeApp({
//    credential: admin.credential.cert(serviceAccount),
//    databaseURL: 'https://myhwcollection-3ac70.firebaseio.com', // Replace with your Firebase project URL
//  });
 


//------------------ hash password and comapare again  ------------------
const hashPassword = function (password) {    

    const salt = bcrypt.genSaltSync(); 
	return bcrypt.hashSync(password, salt); 
}

const comparePassword = function (raw,hash) {    
 
    return bcrypt.compareSync(raw, hash)
}
//------------------ Hash Password end ...............................


//-----------------------  send Welcome Msg ---------------------------  

const sendWelcomeMsg = function (email) {
  //process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
   user: 'vasubirla@gmail.com',
   pass: 'phjwptaxdnaunqol'
 }
});

var mailOptions = {
  from: 'vasubirla@gmail.com',
  to: email,
  subject: 'Welcome to Credx Invoice Management System',
  html: `
      <html>
      <head>
          <style>
              /* Add your CSS styles here */
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f5f5f5;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border: 1px solid #e0e0e0;
                  border-radius: 5px;
              }
              h1 {
                  color: #333;
              }
              p {
                  font-size: 16px;
                  line-height: 1.5;
                  color: #666;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Welcome to Credx Invoice Management System</h1>
              <p>Dear User,</p>
              <p>We are excited to welcome you to our Invoice Management System. You are now part of a community that simplifies invoice management.</p>
              <p>With our system, you can easily create, manage, and track your invoices, ensuring smooth financial transactions.</p>
              <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
              <p>Thank you for choosing Credx!</p>
              <p>Best regards,</p>
              <p>Your Credx Team</p>
              <p>Kilvish Birla</p>
          </div>
      </body>
      </html>
  `
};

transporter.sendMail(mailOptions, function(error, info){  console.log("emailllll sent...............")

 if (error) {
  console.log("error in sending mail")
  //res.json({ result: "failed"});     
 } else {
  console.log("emailllll sent...............")
  //res.json({ result: "success","user_id":user.id,otp:otp}); 
 }
}); 

}








//----------------------- send OTP Helper start ------------------------------- 
const sendMailOTP = function (email,otp,user) {
    //process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
 
 var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
     user: 'vasubirla@gmail.com',
     pass: 'phjwptaxdnaunqol'
   }
 });
 
 var mailOptions = {
  from: 'vasubirla@gmail.com',
  to: email,
  subject: 'OTP to Reset Password - MyRentWish',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <h2 style="color: #333333;">MyRentWish - Password Reset OTP</h2>
      <p style="color: #555555;">Dear User,</p>
      <p style="color: #555555;">You have requested to reset your password on MyRentWish. Please use the following OTP to complete the process:</p>
      <div style="background-color: #ffffff; padding: 10px; border: 1px solid #dddddd; border-radius: 5px; margin-top: 15px;">
        <h3 style="color: #333333;">Your One Time Password (OTP): <span style="color: #007BFF;">${otp}</span></h3>
      </div>
      <p style="color: #555555; margin-top: 15px;">If you did not request a password reset, please ignore this email. The OTP is valid for a short period of time.</p>
      <p style="color: #555555;">Best Regards,<br/>MyRentWish Team</p>
    </div>
  `
};

 
 transporter.sendMail(mailOptions, function(error, info){  
  
   if (error) {
    console.log("error in sending mail")
    //res.json({ result: "failed"});     
   } else {
    console.log("emailllll sent...............")
    //res.json({ result: "success","user_id":user.id,otp:otp}); 
   }
 }); 
 
 }
 


 //------------------- response to query ------------------ 

 
 const responsetoQuery = function (email, message, subject) {
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'vasubirla@gmail.com',
          pass: 'phjwptaxdnaunqol'
      }
  });

  const mailOptions = {
      from: 'vasubirla@gmail.com',
      to: email,
      subject: subject,
      html: `
          <html>
          <head>
              <style>
                  body {
                      font-family: 'Arial', sans-serif;
                  }
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      border: 1px solid #ddd;
                      border-radius: 5px;
                  }
                  .header {
                      text-align: center;
                      background-color: #f5f5f5;
                      padding: 10px;
                      border-radius: 5px 5px 0 0;
                  }
                  .content {
                      padding: 20px;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h2>myrentwish Customer Support</h2>
                  </div>
                  <div class="content">
                      <h3>Hello Sir/Madam,</h3>
                      <p>We have reviewed your query:</p>
                      <p>${message}</p>
                      <p>Our team is working to resolve your concerns. Thank you for reaching out to us.</p>
                      <p>Best regards,</p>
                      <p>The myrentwish Support Team</p>
                  </div>
              </div>
          </body>
          </html>
      `
  };

  transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          console.error(error);
          return false;
      } else {
          console.log("Email sent successfully");
          return true;
      }
  });
};


 //------------------- response to query ------------------ 

 
//  const sendNotification = function (email, message, subject) {
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//   return new Promise((resolve, reject) => {
//     var transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'vasubirla@gmail.com',
//         pass: 'phjwptaxdnaunqol'
//       }
//     });

//     const mailOptions = {
//       from: 'vasubirla@gmail.com',
//       to: email,
//       subject: subject,
//       html: "<h3>Notification From MYHW App :</h1>" + "<h3>" + message + "</h1>"
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//         reject(error); // Email sending failed, reject the Promise
//       } else {
//         console.log("Email sent successfully.");
//         resolve(email); // Email sent successfully, resolve the Promise
//       }
//     });
//   });
// };


const sendNotification = async function (recipients, message, subject) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vasubirla@gmail.com',
      pass: 'phjwptaxdnaunqol'
    }
  });

  const mailOptions = {
    from: 'vasubirla@gmail.com',
    to: recipients.join(', '), // Join all recipients with a comma
    subject: subject,
    html: "<h3>Notification From MYHW App :</h1>" + "<h3>" + message + "</h1>"
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
    return true; // Email sent successfully
  } catch (error) {
    console.error(error);
    return false; // Email sending failed
  }
};


//----------------------- Send Push Notification ------------------------- 



const sendPushNotification = async (ownerID, deviceToken, fromUser_id) => {
  const con = await connection();

  try {
    // Retrieve FCM tokens associated with the owner from tbl_fcm
    const [ownerFCMTokens] = await con.query('SELECT device_token FROM tbl_fcm WHERE user_id = ?', [ownerID]);

    if (!ownerFCMTokens || ownerFCMTokens.length === 0) {
      console.log("Owner FCM tokens not found");
      return;
    }

    // Sending push notifications to ownerFCMTokens
    const title = 'New Property Interest';
    const body = `User with ID ${fromUser_id} is interested in your property!`;

    // Simulate sending push notifications to ownerFCMTokens
    console.log("Sending push notifications to ownerFCMTokens:", ownerFCMTokens);

    // Replace the following with your actual push notification logic using Firebase Admin SDK
    const notificationPayload = {
      notification: {
        title: title,
        body: body,
      },
    };

    const tokens = ownerFCMTokens.map(token => token.device_token);
    const response = await admin.messaging().sendToDevice(tokens, notificationPayload);

    console.log('Successfully sent push notification:', response);

  } catch (error) {
    console.error('Error in sendPushNotification:', error);
  } finally {
    if (con) {
      con.release();
    }
  }
};

//------------------------------------------------------------------------------------------


const sendInvoice1 = async function (email, pdfData) {


  
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vasubirla@gmail.com',
    pass: 'phjwptaxdnaunqol'
  }
 });
 
 var mailOptions = {
   from: 'vasubirla@gmail.com',
   to: email,
   subject: 'Welcome to Credx Invoice Management System',
   html: `
       <html>
       <head>
           <style>
               /* Add your CSS styles here */
               body {
                   font-family: Arial, sans-serif;
                   background-color: #f5f5f5;
               }
               .container {
                   max-width: 600px;
                   margin: 0 auto;
                   padding: 20px;
                   background-color: #ffffff;
                   border: 1px solid #e0e0e0;
                   border-radius: 5px;
               }
               h1 {
                   color: #333;
               }
               p {
                   font-size: 16px;
                   line-height: 1.5;
                   color: #666;
               }
           </style>
       </head>
       <body>
           <div class="container">
               <h1> invoice From Credx Invoice Management System</h1>
               <p>Dear User,</p>
               <p>We Have sent the Invoice Regarding your purchase .</p>
               <p>With our system, you can easily create, manage, and track your invoices, ensuring smooth financial transactions.</p>
               <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
               <p>Thank you for choosing Credx!</p>
               <p>Best regards,</p>
               <p>Your Credx Team</p>
               <p>Kilvish Birla</p>
           </div>
       </body>
       </html>
   `,
   attachments: [
    {
        filename: 'invoice.pdf',
        content: pdfData,
        encoding: 'base64'
    }
]
 };
 
 transporter.sendMail(mailOptions, function(error, info){  console.log("emailllll sent...............")
 
  if (error) {
      console.log("error in sending mail")
   //res.json({ result: "failed"});     
  } else {
    
   console.log("emailllll sent...............")
   //res.json({ result: "success","user_id":user.id,otp:otp}); 
  }
 }); 

};

const sendInvoice = async function (email, pdfData) {
  try {
      var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'vasubirla@gmail.com',
              pass: 'phjwptaxdnaunqol'
          }
      });

      var mailOptions = {
        from: 'vasubirla@gmail.com',
        to: email,
        subject: 'Welcome to Credx Invoice Management System',
        html: `
            <html>
            <head>
                <style>
                    /* Add your CSS styles here */
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f5f5f5;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border: 1px solid #e0e0e0;
                        border-radius: 5px;
                    }
                    h1 {
                        color: #333;
                    }
                    p {
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1> invoice From Credx Invoice Management System</h1>
                    <p>Dear User,</p>
                    <p>We Have sent the Invoice Regarding your purchase .</p>
                    <p>With our system, you can easily create, manage, and track your invoices, ensuring smooth financial transactions.</p>
                    <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
                    <p>Thank you for choosing Credx!</p>
                    <p>Best regards,</p>
                    <p>Your Credx Team</p>
                    <p>Kilvish Birla</p>
                </div>
            </body>
            </html>
        `,
        attachments: [
         {
             filename: 'invoice.pdf',
             content: pdfData,
             encoding: 'base64'
         }
     ]
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response);
      return info;
  } catch (error) {
      console.log("Error in sending mail:", error);
      throw error;
  }
};



const sendOTPFornewPass = async function (email,otp) {   
  
  try {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vasubirla@gmail.com',
            pass: 'phjwptaxdnaunqol'
        }
    });

    var mailOptions = {
      from: 'vasubirla@gmail.com',
      to: email,
      subject: 'Reset Password OTP (MyrentWish)',
      html: `
          <html>
          <head>
              <style>
                  /* Add your CSS styles here */
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f5f5f5;
                  }
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #ffffff;
                      border: 1px solid #e0e0e0;
                      border-radius: 5px;
                  }
                  h1 {
                      color: #333;
                  }
                  p {
                      font-size: 16px;
                      line-height: 1.5;
                      color: #666;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1> Forgot Password Request Service </h1>
                  <p>Dear User,</p>
                  <h2>  ${otp} </h2> <p> is Your OTP to reset Password.</p>
                
                  <p>Thank you for choosing MyrentWish!</p>
                  <p>Best regards,</p>
                  <p>Your MyrentWish Team</p>
                  <p>Kilvish Birla</p>
              </div>
          </body>
          </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return info;
} catch (error) {
    console.log("Error in sending mail:", error);
    throw error;
}

}





export { hashPassword , comparePassword ,sendWelcomeMsg, sendMailOTP , 
  responsetoQuery, sendNotification , sendPushNotification, 
 sendInvoice , sendOTPFornewPass };

