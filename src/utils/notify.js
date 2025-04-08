export const sendNotification=(userId,payload)=>{
    global.io?.to(userId).emit("customNotification",payload);
};