import { Router } from "express";
import prisma from "../../lib/prisma.js";
import Authenticate from "../../middlewares/authenticate.js";

const router = Router()

router.delete("/:id", Authenticate, async (req, res) => {
    const {id} = req.params
    const user = req.user
  
      if(!user) 
          return res.status(400).json({
              message : "User Not Authenticated.",
              data : {}
      })
  
    const {role, is_superuser} = user
  

    // Checking Whether the user is a STAFF
    if(role === 'STAFF') {
        // Checking whether the user is a superuser
      if(is_superuser) {
          try {
              const deletedFabricator = await prisma.fabricator.delete({where : {
                id : id
              }});
              res.status(200).json({
                  message : "Successfully deleted the Fabricator Data.",
                  data : deletedFabricator
              });
            } catch (error) {
              console.error(error);
              res.status(500).json({ message : "Failed to delete fabricator", data : {} });
            } finally {
              prisma.$disconnect()
            }
      } else {
          return res.status(403).json({
              message : "Only superuser can delete fabricator",
              data : {}
          });
      }
    } else {
      return res.status(403).json({
          message : "Only staff admin can delete fabricator",
          data : {}
      });
    }
  });

export default router;