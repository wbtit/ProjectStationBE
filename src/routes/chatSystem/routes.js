import { Router } from "express";

import { createGroup,
         addMemberToGroup,
        groupChatHistory,
        privateChatHistory
 } from "../../controllers/chatSystem"; 

 import Authenticate from "../../middlewares/authenticate";

 const router= Router();

 router.post("/createGroup",Authenticate,createGroup)
 router.post("/group/addmember/:groupId",Authenticate,addMemberToGroup)
 router.get("/groupMessages/:groupId",Authenticate,groupChatHistory)
 router.get("/privateChatRoom/:user1/:user2",Authenticate,privateChatHistory)