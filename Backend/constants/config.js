import dotenv from 'dotenv';

dotenv.config();

const corsOptions = {
    origin: [
     true,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  };
  
  const token = "token";
  
  export { corsOptions, token };