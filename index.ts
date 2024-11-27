import dotenv from 'dotenv'
import express from 'express';

dotenv.config()
const app = express();

// Checking is there any error in connecting to the server!
app.on('error' , (error) => {
    console.error(error)
})

// Starting the server
app.listen(process.env.PORT, () => {
    console.log('Server is active on port ', process.env.PORT)
})