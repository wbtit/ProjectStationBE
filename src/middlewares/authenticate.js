import jwt from "jsonwebtoken";


const Authenticate = async (req, res, next) => {
    const authHeaders = req?.headers?.authorization
    // const authHeaders = req.body?.headers?.Authorization;

    const secret = process.env.SECRET
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
            const payload = (await jwt.verify(token, secret))
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
