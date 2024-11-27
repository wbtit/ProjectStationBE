import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extending Request type to include the 'user' property
interface CustomRequest extends Request {
  user?: JwtPayload;  // Adding the user property
}

const Authenticate = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeaders = req.headers.authorization;

    const secret = process.env.SECRET as string | undefined;
    if (!secret) {
        return res.status(500).json({
            success: false,
            message: 'Secret key is not defined',
        });
    }

    if (authHeaders) {
        const token = authHeaders.split(' ')[1]; 

        try {
            // Using async/await for verify
            const payload = (await jwt.verify(token, secret)) as JwtPayload;
            req.user = payload;  // Assigning decoded payload to req.user
            next();
        } catch (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid token',
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            message: 'Token is not provided',
        });
    }
};

export default Authenticate;
