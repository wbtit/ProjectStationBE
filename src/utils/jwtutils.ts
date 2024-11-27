import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

interface Payload {
  [key: string]: any;  // Define this type based on the structure of your payload
}

export const generateToken = (payload: Payload): string => {
    console.log(payload)
    const secretKey: string = process.env.SECRET as string; // Assuming process.env.SECRET is defined
    const options: SignOptions = { expiresIn: '1h' };  // Defining the options type explicitly

    const token = jwt.sign(payload, secretKey, options);
    return token;
};
