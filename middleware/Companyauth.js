
import jwt from 'jsonwebtoken'
import connection from '../config.js';

const con = await connection();

//authenticate Valid User to access perticualr service & resorce 

const isAuthenticatedCompany = async (req, res, next) => {
    const { Company_token } = req.cookies;  

    if(!Company_token){
        return res.redirect('/login')
        
    }

    try {      
        const decodedData = jwt.verify(Company_token, process.env.JWT_SECRET);
        const con = await connection();
        const [[company]] = await con.query('SELECT * FROM tbl_company WHERE company_id = ?', [decodedData.id]);
        req.company = company;
        res.app.locals.company =  req.company;
        next();   

    } catch (error) {
        console.log("error in setting req.company ->", error)
        return res.redirect('/login')
    }
};


const companyOTP  = async (req, res, next) => {


    //options for tokens  
        const options = {
            expires: new Date(
                Date.now() + 1*60*60*1000
            ), 
            httpOnly:true
        }                 
    res.status(200).cookie('companyOTP',otp,options).redirect('/admin') 

 
      next()
};


//Authenticate Admin 

const authorizeRoles = (...roles) =>{
        
    return (req,res,next)=>{
       
        if(!roles.includes(req.company.role) ){
               // res.json("User not allowed to do this ")
                res.render('login1',{'output':'Your Role is not permitted to Login here !'})  
        }
        else
        {
            next()
        }
    }

}


export {isAuthenticatedCompany , companyOTP }
