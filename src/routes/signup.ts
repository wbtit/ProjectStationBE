import { hashPassword } from '../utils/crypter';// For hashing the password
import prisma from '../lib/prisma';
import { Router } from 'express';

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
        // Call the createUser function to add the user to the database

        console.log(
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
            is_firstLogin )

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
            data: newUser
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        prisma.$disconnect()
    }
});

export default router
