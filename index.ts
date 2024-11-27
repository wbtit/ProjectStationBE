import dotenv from 'dotenv';
import express from 'express';
import Login from './src/routes/login';
import SignUp from "./src/routes/signup"
import { getUsers } from './src/models/userAllModel';

dotenv.config();
const app = express();
app.use(express.json())

app.get('/', (req, res) => {
    console.log("I am getting hit!!");
    res.status(200).json({
        message: "You found me 😂",
        data: {
            json: "json"
        }
    });
});

app.get('/getall', async(req, res) => {
    console.log("Hola")

    try {
        const users = await getUsers()
        console.log(users)
        res.status(200).json({
            message : "Success",
            data : users
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message : "Unsuccess"
        })
    }

   
})

app.use('/login', Login);
app.use('/signup', SignUp)

const PORT = process.env.PORT || 3000;  // Default to 3000 if PORT is not set
app.listen(PORT, () => {
    console.log('Server is active on port ', PORT);
});