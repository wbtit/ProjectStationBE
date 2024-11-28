import { Router } from "express";
import { generateToken } from "../../utils/jwtutils.js";
import { comparePassword } from "../../utils/crypter.js";
import { getUserByUsername } from "../../models/userUniModel.js";

const route = Router()

//@ts-ignore
route.post('/', async(req, res) => {
    console.log('hello')
    console.log(req.body)
    let {username, password } = req.body

    if(!username || !password) {
        return res.status(401).json({
            success: false,
            message: "Fields are empty!!",
          });
    }
    
    try {
        // Find the user by username
        const user = await getUserByUsername(username)
    
        console.log(user)
    
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
    
        // Compare the provided password with the stored hashed password
        //@ts-ignore
        console.log(password, user.password)
        password = typeof password === "number" ? password.toString() : password;
        //@ts-ignore
        const isPasswordValid = await comparePassword(password, user.password);
    
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: "Invalid password",
          });
        }

        const token = generateToken(user)

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
          });

      } catch (error) {
        console.log(error)
        res.status(500).json({
          success: false,
          message: "Error logging in",
        });
      }

})

export default route