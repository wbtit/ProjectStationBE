import { Router } from "express";
import prisma from "../../lib/prisma.js";
import Authenticate from "../../middlewares/authenticate.js";

const router = Router();

router.patch("/:id", Authenticate, async (req, res) => {
  const {id} = req.params
  const user = req.user

    console.log(user) 

    if(!user) 
        return res.status(400).json({
            message : "User Not Authenticated.",
            data : {}
    })

    const {role, is_superuser} = user

  const updateData = req.body;

    // Checking whether the user is Staff
  if(role === 'STAFF') {
    // Checking whether the user is superuser
    if(is_superuser) {
        try {
            const updatedFabricator = await prisma.fabricator.update({
              where: { id: id },
              data: updateData,
            });
            res.status(200).json({
                message : "Successfully Updated the Fabricator Data.",
                data : updatedFabricator
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message : "Failed to update fabricator", data : {} });
          } finally {
            prisma.$disconnect()
          }
    } else {
        return res.status(403).json({
            message : "Only superuser can update fabricator",
            data : {}
        });
    }
  } else {
    return res.status(403).json({
        message : "Only staff admin can update fabricator",
        data : {}
    });
  }
});

export default router;