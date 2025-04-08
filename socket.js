import { Socket } from "socket.io"

const userSocketMap= new Map()

const initSocket=(io)=>{

io.on("connection",(socket)=>{
    console.log(`User connected userId: ${socket.id}`)

    socket.on("joinRoom",(userId)=>{
        if(!userId) return;
        socket.join(userId)
        userSocketMap.set(userId,socket.id)
        console.log(`User ${userId} joined room`)
    })

    socket.on("disconnect",()=>{
        for(const [userId,id] of userSocketMap.entries()){
            if(id=== socket.id){
                userSocketMap.delete(userId);
                break;
            }
        }
        console.log(`Socket disconnected: ${socket.id}`)
    })
})
}
export {initSocket};