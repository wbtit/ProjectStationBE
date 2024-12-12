import prisma from "../../lib/prisma.js";
import Authenticate from "../../middlewares/authenticate.js";
import { Router } from "express";
import { sendResponse } from "../../utils/responder.js";
import { getUserByID } from "../../models/userUniModelByID.js";
import { isAdmin } from "../../middlewares/isadmin.js";

const router = Router();

router.post('/', Authenticate, isAdmin, async (req, res) => {
    
    const {id } = req.user

    const {name, managerID} = req.body

    if(!name || !managerID) 
        return sendResponse({message : "Incomplete credentials.", res , statusCode : 400, success : false, data : null})

    const user = await getUserByID({id : managerID})

    if(!user) 
        return sendResponse({message : "Invalid Manager ID.", res , statusCode : 400, success : false, data : null})


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

})

export default router