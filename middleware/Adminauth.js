
import jwt from 'jsonwebtoken'
import connection from '../config.js';

const con = await connection();

//authenticate Valid User to access perticualr service & resorce 
// const isAuthenticatedAdmin = async(req,res,next)=>{

//     const {Admin_token }= req.cookies ;

//         if(!Admin_token){

//             return res.redirect('/admin/login')
          
//         }

//         const decodedData = jwt.verify(Admin_token,process.env.JWT_SECRET); 
    
//     const con = await connection();
//     const [results] = await con.query('SELECT * FROM tbl_admin WHERE id = ?', [decodedData.id]);

//         req.admin = results[0];
//         next();
      
      
// }

const isAuthenticatedAdmin = async (req, res, next) => {
    const { Admin_token } = req.cookies;

    if (!Admin_token) {
        return res.redirect('/admin/login');
    }

    try {
        const decodedData = jwt.verify(Admin_token, process.env.JWT_SECRET);
        const con = await connection();
        const [results] = await con.query('SELECT * FROM tbl_admin WHERE id = ?', [decodedData.id]);
    
            req.admin = results[0];
            next();
    } catch (error) {
        return res.redirect('/admin/login');
    }
};



//Authenticate Admin 

const authorizeRoles = (...roles) =>{
        
    return (req,res,next)=>{
       
        if(!roles.includes(req.admin.role) ){
               // res.json("User not allowed to do this ")
                res.render('login1',{'output':'Your Role is not permitted to Login here !'})  
        }
        else
        {
            next()
        }
    }

}


export {isAuthenticatedAdmin }