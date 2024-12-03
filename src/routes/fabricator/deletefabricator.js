import { Router } from "express";
import prisma from "../../lib/prisma.js";
import Authenticate from "../../middlewares/authenticate.js";
import { sendResponse } from "../../utils/responder.js";

const router = Router()

router.delete("/:id", Authenticate, async (req, res) => {
    const {id} = req.params
    const user = req.user
  
      if(!user) 
        return sendResponse({message : "User not Authenticated", res , statusCode : 403, success : false, data : null})
  
    const {role, is_superuser} = user
  

    // Checking Whether the user is a STAFF
    if(role === 'STAFF') {
        // Checking whether the user is a superuser
      if(is_superuser) {
          try {
              const deletedFabricator = await prisma.fabricator.delete({where : {
                id : id
              }});
              return sendResponse({message : "Successfully deleted the fabricator data.", res, statusCode : 200, success : true, data : deletedFabricator})
            } catch (error) {
              console.error(error);
              return sendResponse({message : "Failed to delete fabricator.", res , statusCode : 500, success : false, data : null})
            } finally {
              prisma.$disconnect()
            }
      } else {
        return sendResponse({message : "Only superuser can delete fabricator.", res , statusCode : 403, success : false, data  : null})
      }
    } else {
      return sendResponse({message : "Only staff admin can delete fabricator.", res , statusCode : 403, success : false, data : null})
    }
  });

export default router;