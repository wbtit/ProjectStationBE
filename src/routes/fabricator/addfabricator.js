import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import prisma from "../../lib/prisma.js";

const router = Router()

router.post('/', Authenticate, async(req, res) => {
    console.log(req.user)

    if(!req.user) {
        return res.send(404).json({
            message : "User not Authenticated.",
            data : {}   
        })
    }

    const {id, is_superuser } = req.user

    const {name, headquater, website, drive} = req.body;

    if(!id) {
        return res.send(404).json({
            message : "User not found.",
            data : {}   
        })
    }

    // Checking the user is a super user.
    if(is_superuser) {

        try {
            const fabricator = await prisma.fabricator.create({
                data : {
                    createdById : id,
                    fabName : name,
                    headquaters : headquater,
                    drive : drive,
                    website : website
                }
            })
    
            return res.status(400).json({
                message : "Fabricator Added Successfully.",
                data : fabricator
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message : "Sorry Something went wrong.",
                data : {}
            })
        } finally {
            prisma.$disconnect()
        }
       

    } else {
        return res.status(404).json({
            message : "Only superuser can add fabricators",
            data : {}
        })
    }
})

export default router;