import multer from "multer";
import path from "path"
import fs from "fs"

const uploadDir=path.join(__dirname,"../../uploads");
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir,{recursive:true});

const storage= multer.diskStorage({
    destination:(req,file,cb)=>cb(null,uploadDir),
    filename:(req,file,cb)=>{
        const uniqueName=Date.now() + '-' + file.originalname.replace(/\s+/g, '_')
        cb(null,uniqueName)
    }
})
module.exports= multer({storage})