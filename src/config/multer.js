import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createMulterUploader(uploadDir, fileMap) {
  const absoluteDir = path.join(__dirname, "..", "..", uploadDir); // project-root/public/rfitemp

  if (!fs.existsSync(absoluteDir)) {
    fs.mkdirSync(absoluteDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, absoluteDir),
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

  return multer({ storage });
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

export const changeOrderResponse={};
export const changeOrderResponseUploads=createMulterUploader("public/changeOrderTabletemp",changeOrderResponse)

export const notesDataMap={};
export const notesUploads=createMulterUploader("public/notesTemp",notesDataMap)

export const estimationDataMap={};
export const estimationUploads=createMulterUploader("public/estimationtemp",estimationDataMap)