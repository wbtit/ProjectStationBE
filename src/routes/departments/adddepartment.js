import prisma from "../../lib/prisma.js";
import Authenticate from "../../middlewares/authenticate.js";
import { Router } from "express";
import { sendResponse } from "../../utils/responder.js";
import { getUserByID } from "../../models/userUniModelByID.js";

const router = Router();

router.post('/',Authenticate, async(req, res) => {

    if(!req.user) {
        return sendResponse({message : "User not Authenticated.", res , statusCode : 403, success : false, data : null})
    }

    const {id, is_superuser } = req.user

    if(!is_superuser) 
    return sendResponse({message : "Only Admin can add department.", res , statusCode : 400, success : false, data : null})

    const {name, managerID} = req.body

    if(!name || !managerID) 
        return sendResponse({message : "Incomplete credentials.", res , statusCode : 400, success : false, data : null})

    const user = await getUserByID({id : managerID})

    if(!user) 
        return sendResponse({message : "Invalid Manager ID.", res , statusCode : 400, success : false, data : null})

    console.log(user)

    const {is_active, is_staff, username} = user

    if(is_active && is_staff) {
        try {
            const department = await prisma.department.create({
                data : {
                    name,
                    createdById : id,
                    managerId : managerID
                }
            })
        return sendResponse( {message : "Department created successfully.", res , statusCode  : 200, success : true, data : department})
        } catch (error) {
            return sendResponse({message : "Something went wrong!!", res , statusCode : 500, success : false, data : null})
        } finally {
            await prisma.$disconnect()
        }

    } else {
        return sendResponse({message : `${username} is not a manager.`, res , statusCode : 403, success : false, data : null})
    }




    return sendResponse({message : `Department is supposed to be named ${name} and the manager is ${managerID} and created by ${id} and is a superuser ?, ${is_superuser}`, res , statusCode : 200, success : true, data : user})


})

export default router