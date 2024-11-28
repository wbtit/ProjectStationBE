import jwt from 'jsonwebtoken';

export const generateToken = (payload)=> {
    console.log(payload)
    const secretKey = process.env.SECRET; // Assuming process.env.SECRET is defined
    const options = { expiresIn: '1h' };  // Defining the options type explicitly

    const token = jwt.sign(payload, secretKey, options);
    return token;
};
