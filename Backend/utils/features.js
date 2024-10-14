import mongoose from "mongoose";
import dotenv from 'dotenv';
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64, getSockets } from "../lib/helper.js";
import jwt from 'jsonwebtoken';
dotenv.config();

export const cookieOptions = {
	maxAge: 15 * 24 * 60 * 60 * 1000,
	sameSite: "none",
	httpOnly: true,
	secure: true,
  };

const dbConnect = () => {
	// Connecting to the database using the provided URL from the environment variables
	mongoose.connect(process.env.MONGO_URI,{
			family: 4,
		})
		// If the connection is successful, log a success message
		.then(() => console.log("DB CONNECTION SUCCESS"))
		// If there are issues connecting to the database, log an error message and exit the process
		.catch((err) => {
			console.log(`DB CONNECTION ISSUES`);
			console.error(err.message);
			process.exit(1);
		});
};

const sendToken = (res, user, code, message) => {
	const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  
	return res.status(code).cookie("token", token, cookieOptions).json({
	  success: true,
	  user,
	  message,
	});
  };

  // Delete files from cloudinary
const deletFilesFromCloudinary = async (public_ids) => {
	const deletePromises = public_ids.map((publicId) => {
		return new Promise((resolve, reject) => {
		  cloudinary.uploader.destroy(publicId, (error, result) => {
			if (error) return reject(error);
			resolve(result);
		  });
		});
	  });
	
	  try {
		const results = await Promise.all(deletePromises);
		return results;
	  } catch (err) {
		throw new Error("Error deleting files from Cloudinary", err);
	  }
  };

  const emitEvent = (req, event, users, data) => {
    console.log("Emitting event:", event);
    console.log("To users:", users);
    console.log("With data:", data);
    try {
        const io = req.app.get("io");
        const usersSocket = getSockets(users);
        io.to(usersSocket).emit(event, data);
    } catch (error) {
        console.error("Error in emitEvent:", error);
    }
}

const uploadFilesToCloudinary = async (files = []) => {
	const uploadPromises = files.map((file) => {
	  return new Promise((resolve, reject) => {
		cloudinary.uploader.upload(
		  getBase64(file),
		  {
			resource_type: "auto",
			public_id: uuid(),
		  },
		  (error, result) => {
			if (error) return reject(error);
			resolve(result);
		  }
		);
	  });
	});
  
	try {
	  const results = await Promise.all(uploadPromises);
       
	//   console.log("result",results);
	  
	  const formattedResults = results.map((result) => ({
		public_id: result.public_id,
		url: result.secure_url,
	  }));
	  return formattedResults;
	} catch (err) {
	  throw new Error("Error uploading files to cloudinary", err);
	}
  };
  

export {dbConnect,emitEvent,deletFilesFromCloudinary,uploadFilesToCloudinary,sendToken};