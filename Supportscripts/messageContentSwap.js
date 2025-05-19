import prisma from "../src/lib/prisma.js";
import { Compression } from "../src/utils/Zstd.js";

async function migrateOldMessages() {
 const messages= await prisma.message.findMany({
    where:{
        contentCompressed:null,
        NOT:{content:null}
    }
 })  
 
 for( const msg in messages){
    const compressed= Compression(msg.content)
    await prisma.message.update({
        where:{id:msg.id},
        data:{contentCompressed:compressed}
    })
 }
 console.log("Migration completed")
}
migrateOldMessages()