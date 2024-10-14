
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user.js';
import { adminSecretKey } from '../index.js';
import {token} from '../constants/config.js';
import { ErrorHandler } from "../utils/utility.js";

dotenv.config();

export const auth =async (req,res,next)=>{
    const token =req.cookies["token"];
   

    if(!token)
        return res.json({message:"Login First"});

   

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedData._id;

  next();
}

export const adminOnly= (req,res,next)=>{
    const token=req.cookies["admin-token"];

    if(!token){
      return  res.status(401).json({message:"Only admin can access this route"})
    }
   
    const secretKey = jwt.verify(token, process.env.JWT_SECRET);

    const isMatched = secretKey === adminSecretKey;
    
    if(!isMatched){
       return res.status(401).json({message:"Only admin can access this route"})
    }

    next();
}


export const socketAuthenticator = async (err, socket, next) => {
    try {
      if (err) return next(err);
  
      const authToken = socket.request.cookies[token];

      // console.log("token is",authToken);
  
      if (!authToken)
        return next(new ErrorHandler("1 Please login to access this route", 401));
  
      const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);
  
      const user = await User.findById(decodedData._id);
  
      if (!user)
        return next(new ErrorHandler("2 Please login to access this route", 401));
  
      socket.user = user;
  
      return next();
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler("3 Please login to access this route", 401));
    }
  };