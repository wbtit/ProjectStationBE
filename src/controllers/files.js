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
  }lastAccess
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

const viewFile=async(req,res)=>{
    const{fileId}=req.params
    try {
        const file= await prisma.File.findUnique({where:{id:fileId}})
        if(!file) return sendResponse({
            message:"File not found",
            statusCode:400,
            success:false,
            data:null
        })

        const fullPath= path.join(__dirname,'../../',file.path)
        if(!fs.existsSync(fullPath)) return sendResponse({
            message:"Missing file in server",
            statusCode:404,
            success:false,
            data:null
        })
        res.setHeader('Content-Type', file.mimeType);
        res.setHeader('Content-Disposition', 'inline');

        const stream=fs.createReadStream(fullPath)
        stream.pipe(res)

        await prisma.File.update({where:{id:fileId},data:{lastAccess:new Date()}})
    } catch (error) {
        console.log(error.message)
        return sendResponse({
            message:"Could not view file",
            statusCode:500,
            success:false,
            data:null
        })
    }
}

const downloadFile=async(req,res)=>{
    const {fileId}=req.params
    try {
       const file= await prisma.File.findUnique({where:{id:fileId}})
        if(!file) return sendResponse({
            message:"File not found",
            statusCode:400,
            success:false,
            data:null
        })

        const fullPath= path.join(__dirname,'../../',file.path)
        if(!fs.existsSync(fullPath)) return sendResponse({
            message:"Missing file in server",
            statusCode:404,
            success:false,
            data:null
        })
        res.download(fullPath,file.originalName)
    } catch (error) {
        console.log(error)
        return sendResponse({
            message:"Could not download the file",
            statusCode:500,
            success:false,
            data:null
        })
    }
}

export{
    fileUpload,
    viewFile,
    downloadFile
}