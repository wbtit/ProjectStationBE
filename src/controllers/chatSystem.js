import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const createGroup=async(req,res)=>{
    const{name}=req.body
    const{id}=req.user
    try {
        if(!name){
           return sendResponse({
                message:"Enter a Group name",
                res,
                statusCode:400,
                success:false,
                data:null
            })
        }
        const newGroup= await prisma.group.create({
            data:{
                name:name,
                adminId:id
            }
        })
        await prisma.groupUser.create({
            data:{
                memberId:id,
                groupId:newGroup.id
            }
        })
        return sendResponse({
            message:"Create a group successfully",
            res,
            statusCode:200,
            success:true,
            data:newGroup
        })
    } catch (error) {
        console.log(error)
        return sendResponse({
            message:"Failed to Create a group",
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }
}

const addMemberToGroup = async (req, res) => {
    const memberIds  = req.body;
    const { groupId } = req.params;
  
    console.log("Full req.body:",  );
    
 
  
    try {
      if (!memberIds || !groupId || !Array.isArray(memberIds)) {
        return sendResponse({
          message: "Please provide an array of memberIds and a groupId",
          res,
          statusCode: 400,
          success: false,
          data: null,
        });
      }
  
      const membership = await Promise.all(
        memberIds.map((id) =>
          prisma.groupUser.create({
            data: {
              memberId: id,
              groupId: groupId,
            },
          })
        )
      );
  
      console.log("membership", membership);
      return sendResponse({
        message: "Users added successfully",
        res,
        statusCode: 200,
        success: true,
        data: membership,
      });
    } catch (error) {
      console.log(error.message);
      return sendResponse({
        message: "Failed to add member(s) to group",
        res,
        statusCode: 500,
        success: false,
        data: null,
      });
    }
  };
  
const groupChatHistory=async(req,res)=>{
    const {groupId}=req.params
    const { lastMessageId, limit = 20 } = req.query;
    try {
        if(!groupId){
        return sendResponse({
            message:"groupId is required",
            res,
            statusCode:500,
            success:false,
            data:null
        })
        }
        const groupMessages= await prisma.message.findMany({
            where:{groupId:groupId},
            include:{
                sender:true,
                taggedUsers :true,
            },
            ...(lastMessageId && {
                skip: 1,
                cursor: { id: lastMessageId },
              }),
              take: parseInt(limit),
            orderBy:{createdAt:'desc'},
            
        })

        return sendResponse({
            message:"ChatHistory fetched successfully",
            res,
            statusCode:200,
            success:true,
            data:groupMessages
        })
    } catch (error) {
        console.log(error.message)
        return sendResponse({
            message:"Failed to load the Group ChatHistory",
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }
}
const privateChatHistory=async(req,res)=>{
    const{user1,user2}=req.params
    const {lastMessageId}=req.query
    try {
        if(!user1 || user2){
            return sendResponse({
                message:"users IDs are required",
                res,
                statusCode:400,
                success:false,
                data:null
            })
        }
        const privateChats= await prisma.message.findMany({
            where:{
                or:[
                    {senderId:user1,receiverId:user2},
                    {senderId:user2,receiverId:user1},
                ]
            },
            include:{
                sender:true,
                receiver:true
            },
            ...(lastMessageId && {
                skip: 1,
                cursor: { id: lastMessageId },
              }),
              take: parseInt(limit),  
            orderBy:{createdAt:'desc'}
        })
        return sendResponse({
            message:"ChatHistory fetched successfully",
            res,
            statusCode:200,
            success:true,
            data:privateChats
        }) 
    } catch (error) {
        return sendResponse({
            message:"Failed to load the Private ChatHistory",
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }
}

const recentchats = async (req, res) => {
    const { id } = req.user;
  //console.log("userId",id)
    try {
      // Fetch recent private messages
      const privateMessages = await prisma.message.findMany({
        where: {
          OR: [{ senderId: id }, { receiverId: id }],
          receiverId: { not: null }
        },
        orderBy: { createdAt: 'desc' }
      });
      //console.log("Private Messages:", privateMessages);
      const privateMap = new Map();
  
      for (const msg of privateMessages) {
        const otherUserId = msg.senderId === id ? msg.receiverId : msg.senderId;
  
        if (!privateMap.has(otherUserId)) {
          const user = await prisma.users.findUnique({
            where: { id: otherUserId },
            select: {
              f_name: true,
              m_name: true,
              l_name: true,
              username: true,
              role: true,
              emp_code: true
            }
          });
  
          privateMap.set(otherUserId, {
            type: "private",
            user,
            lastMessage: msg.content,
            timestamp: msg.createdAt
          });
        }
      }
  
      // Fetch group messages + memberships
      const groupMembership = await prisma.groupUser.findMany({
        where: { memberId: id },
        select: { groupId: true }
      });
      //console.log("Group Memberships:", groupMembership);
      const groupIds = groupMembership.map(g => g.groupId);
  
      const groupMessages = await prisma.message.findMany({
        where: { groupId: { in: groupIds } },
        orderBy: { createdAt: 'desc' }
      });
      //console.log("Group Messages:", groupMessages);
      const groupMap = new Map();
  
      for (const msg of groupMessages) {
        if (!groupMap.has(msg.groupId)) {
          const group = await prisma.group.findUnique({ where: { id: msg.groupId } });
          groupMap.set(msg.groupId, {
            type: "group",
            group,
            lastMessage: msg.content,
            timestamp: msg.createdAt
          });
        }
      }
  
      const allGroups = await prisma.group.findMany({
        where: { id: { in: groupIds } }
      });
      //console.log("allGroups",allGroups)
      const groupChatsSidebarItems = allGroups.map(group => {
        const msgInfo = groupMap.get(group.id) || {};
        return {
          type: "group",
          group,
          lastMessage: msgInfo.lastMessage || null,
          timestamp: msgInfo.timestamp || null
        };
      });
      //console.log("groupChatsSidebarItems",groupChatsSidebarItems)
  
      // Combine all chats and sort
      const combinedChats = [
        ...privateMap.values(),
        ...groupChatsSidebarItems
      ].sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
  
      return sendResponse({
        message: "Fetched recent chats successfully",
        res,
        statusCode: 200,
        success: true,
        data: combinedChats
      });
  
    } catch (error) {
      console.log(error.message);
      return sendResponse({
        message: "Failed to load the recent Chats",
        res,
        statusCode: 500,
        success: false,
        data: null
      });
    }
  };
  

  const deleteMembersInGroup=async(req,res)=>{
    const {groupId,memberId}=req.params
    if(!groupId || !memberId){
      return sendResponse({
        message:"MemberId and GroupId is required",
        res,
        statusCode:400,
        success:false,
        data:null
    })
    }
    try {
      const groupmember= await prisma.groupUser.findFirst({
        where:{
          memberId:memberId,
          groupId:groupId
        }
      })
      if(!groupmember){
        return sendResponse({
          message:"No such user in the group",
          res,
          statusCode:404,
          success:false,
          data:null
      }) 
      }
      const deletedmember= await prisma.groupUser.delete({
        where:{id:groupmember.id}
      })

      return sendResponse({
        message:"user removed from the group",
        res,
        statusCode:200,
        success:true,
        data:deletedmember
    })
    } catch (error) {
      console.log(error.message);
      return sendResponse({
        message: "Failed to load the recent Chats",
        res,
        statusCode: 500,
        success: false,
        data: null
      }); 
    }
  }

  const getgroupMembers=async(req,res)=>{
    const {groupId}=req.params
    if(!groupId){
      return sendResponse({
        message:"GroupId is required",
        res,
        statusCode:400,
        success:false,
        data:null
    })
  }
    try {
      const getGroupMembers= await prisma.group.findUnique({
        where:{id:groupId},
        include:{
          members:{
            include:{
              members:true
            }
          }
        }
      })

      return sendResponse({
        message:"Group members successfully fetched",
        res,
        statusCode:200,
        success:true,
        data:getGroupMembers
      })
    } catch (error) {
      console.log(error.message)
      return sendResponse({
        message: "Failed to load Group Members",
        res,
        statusCode: 500,
        success: false,
        data: null
      }); 
    
  }
}
export{
  createGroup,
  addMemberToGroup,
  groupChatHistory,
  privateChatHistory,
  recentchats,
  deleteMembersInGroup,
  getgroupMembers
}