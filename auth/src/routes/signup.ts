import express, { Request, response, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";


import { User } from '../models/User';
import { validateRequest,BadRequestError } from "@oscargmk8s/common";
/* import { BadRequestError } from './../errors/bad-request-error';
import { validateRequest } from "../middlewares/validate-requests"; */

const router = express.Router();

router.post(
   "/api/users/signup",
   [
     body("email").isEmail().withMessage("Email must be valid"),
     body("password").trim().isLength({ min: 4, max: 20 })
     .withMessage("Password must be between 4 and 20 characters")
   ],
   validateRequest ,
   async (req: Request, res: Response) => {
      //Hay que comprobar si el email existe ya 
      const { email,password } = req.body;
      const existingUser = await User.findOne({ email});
      
      if(existingUser){
        throw new BadRequestError('Email in use');
      } 

      const user= User.build({
        email: email,
        password: password
      })
      await user.save();
      // justo despues de guardar el usuario es cuando querré almacenar el token en la cookie
     
      // Generate JWT
      const userJwt = jwt.sign(
        {
        id: user.id,
        email:user.email
        }
      ,process.env.JWT_KEY!);
 
      // Store it on session object
      req.session = {
        jwt: userJwt
      };

      res.status(201).send(user);
     } 
 );
export { router as signupRouter };