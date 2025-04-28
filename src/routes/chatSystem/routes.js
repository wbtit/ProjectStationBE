import { Router } from "express";

import { createGroup,
         addMemberToGroup,
        groupChatHistory,
        privateChatHistory,
        recentchats,
        deleteMembersInGroup,
        getgroupMembers
 } from "../../controllers/chatSystem.js"; 

 import Authenticate from "../../middlewares/authenticate.js";

 const router= Router();


 //{base_url}/api/chat/.......

 router.post("/createGroup",Authenticate,createGroup)
 router.post("/group/addMember/:groupId",Authenticate,addMemberToGroup)
 router.get("/groupMessages/:groupId",Authenticate,groupChatHistory)
 router.get("/privateChatRoom/:user1/:user2",Authenticate,privateChatHistory)
 router.get("/recent-chats",Authenticate,recentchats)

 //getMembers and removeMemeber
 router.delete("/removeMember/:groupId/:memberId",Authenticate,deleteMembersInGroup)
 router.get("/getGroupMembers/:groupId",Authenticate,getgroupMembers)


 export {router as chatRouter}