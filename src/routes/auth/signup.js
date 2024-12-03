import { hashPassword } from '../../utils/crypter.js'; // For hashing the password
import prisma from '../../lib/prisma.js';
import { Router } from 'express';
import { getUserByUsername } from '../../models/userUniModel.js';

const router = Router()

// User service for creating user
const createUser = async ({
    username,
    password,
    email,
    f_name,
    m_name,
    l_name,
    phone,
    role,
    is_active,
    is_staff,
    is_superuser,
    is_firstLogin
}) => {
    try {
        // Hash the password before storing
        const hashedPassword = await hashPassword(password);
        console.log(hashedPassword)
        // Create user in the database
        const newUser = await prisma.users.create({
            data: {
                username,
                password: hashedPassword,
                email,
                f_name,
                m_name,
                l_name,
                phone,
                role,
                is_active,
                is_staff,
                is_superuser,
                is_firstLogin
            }
        });
        return newUser;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    } finally {
        prisma.$disconnect()
    }
};

// User route to handle user creation
router.post('/', async (req, res) => {
    const { 
        username, 
        password, 
        email, 
        f_name, 
        m_name, 
        l_name, 
        phone, 
        role, 
        is_active, 
        is_staff, 
        is_superuser, 
        is_firstLogin 
    } = req.body;

    try {


        // Check whether the username is available or not.

        const isExist = await getUserByUsername(username);

        // If user exists on that username then return the response.
        if(isExist) 
            return res.status(409).json({
                success : false,
                message : "Username already taken."
        })

        

        const newUser = await createUser({
            username, 
            password, 
            email, 
            f_name, 
            m_name, 
            l_name, 
            phone, 
            role, 
            is_active, 
            is_staff, 
            is_superuser, 
            is_firstLogin
        });

        // Respond with the created user data
        res.status(201).json({
            success: true,
            message : "User Created Successfully",
            data: newUser
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message,
            data : {}
        });
    } finally {
        prisma.$disconnect()
    }
});

export default router
