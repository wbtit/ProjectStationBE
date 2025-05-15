import generateFileHashStream from "../utils/hashStream.js"
import fs from "fs"
import path from "path"
import { sendResponse } from "../utils/responder.js"
import prisma from "../lib/prisma.js"

const fileUpload=async(req,res)=>{
    const files=req.files
    const {
    projectId, fabricatorId, submittalsId, submittalsResponseId,
    rfiId, rfiResponseId, rfqId, rfqResponseId, CoId, CoResponseId
  } = req.body;

  if(!files || files.length===0){
    return sendResponse({
        message:"No files uploaded",
        statusCode:400,
        success:false,
        data:null
    })
  }
  try {
    const uploadedFiles=[];

    for( const file of files){
        const hash= await generateFileHashStream(file.path)
        const existing= await prisma.File.findUnique({where:{hash}})

        if(existing){
            fs.unlinkSync(file.path)//remove duplicate from disk
            uploadedFiles.push({reused:false,fileId:existing.id})
            continue
        }
        const fileData={
            originalName:file.originalName,
            mimeType:file.mimeType,
            size:file.size,
            path:file.path.replace(path.resolve(__dirname,'../../'),''),
            hash,
            projectId, fabricatorId, submittalsId, submittalsResponseId,
            rfiId, rfiResponseId, rfqId, rfqResponseId, CoId, CoResponseId,
        }
        const created= await prisma.File.create({data:fileData})
        uploadedFiles.push({reused:false,fileId:created.id})
    }
    return sendResponse({
        message:"Files uploaded",
        statusCode:200,
        success:true,
        data:uploadedFiles
    })
  } catch (error) {
    console.log(error.message)
    return sendResponse({
        message:error.message,
        statusCode:500,
        success:false,
        data:null
    })
  }
}