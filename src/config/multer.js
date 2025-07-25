import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

function createMulterUploader(uploadDir, fileMap) {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir); // ✅ this was missing
    },
    filename: (req, file, cb) => {
      const uniqueId = uuidv4();
      const ext = path.extname(file.originalname);
      const newFileName = `${uniqueId}${ext}`;

      fileMap[newFileName] = {
        originalName: file.originalname,
        uuid: uniqueId,
        mimetype: file.mimetype,
      };

      cb(null, newFileName);
    },
  });

  return multer({
    storage,
    fileFilter: (req, file, cb) => cb(null, true),
  });
}

export const fileDataMap = {};
export const uploads = createMulterUploader("public/projecttemp", fileDataMap);

export const submittalsDataMap = {};
export const submittalsUploads=createMulterUploader("public/submittalstemp",submittalsDataMap)

export const submittalResponseMap={};
export const SubmittalsResponseUploads= createMulterUploader("public/submittalsResponsetemp",submittalResponseMap)

export const rfiDataMap = {};
export const rfiUploads=createMulterUploader("public/rfitemp",rfiDataMap)

export const rfiResponseDataMap={};
export const rfiResponseUploads=createMulterUploader("public/rfiResponsetemp",rfiResponseDataMap)

export const rfqresponseDataMap={};
export const rfqResponseUploads=createMulterUploader("public/rfqResponsetemp",rfiResponseDataMap)

export const rfqDataMap={};
export const rfqUploads=createMulterUploader("public/rfqtemp",rfqDataMap)

export const fabricatorDataMap = {};
export const fabricatorsUploads=createMulterUploader("public/fabricatortemp",fabricatorDataMap)

export const changeOrderDataMap = {};
export const changeorderUploads=createMulterUploader("public/changeordertemp",changeOrderDataMap)

export const changeOrderTableDataMap={};
export const changeOrderTableUploads=createMulterUploader("public/changeOrderTabletemp",changeOrderTableDataMap)

