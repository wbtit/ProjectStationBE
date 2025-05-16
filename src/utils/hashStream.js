
import crypto from "crypto"
import fs from "fs"


export default function generateFileHashStream(filePath){
    return new Promise((resolve,reject)=>{
        const hash=crypto.createHash("sha256")
        const stream=fs.createReadStream(filePath)

        stream.on('data',chunk=>hash.update(chunk))
        stream.on('end',resolve(hash.update('hex')))
        stream.on('error',reject)
    })
}
