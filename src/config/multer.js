import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const fileDataMap = {}; // Object to store file data (UUID and original name)
const submittalsDataMap = {};
const submittalResponseMap={};
const rfiDataMap = {};
const rfiResponseDataMap={};
const rfqresponseDataMap={};
const rfqDataMap={};
const fabricatorDataMap = {};
const commentDataMap = {};
const changeOrderDataMap = {};
const changeOrderTableDataMap={};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/projecttemp"); // Folder to store files
  },
  filename: (req, file, cb) => {
    // Generate a UUID
    const uniqueId = uuidv4();
    // File's extension
    const fileExt = path.extname(file.originalname);
    // Set filename as UUID + file extension
    const newFileName = `${uniqueId}${fileExt}`;

    // Add file data to the object
    fileDataMap[newFileName] = {
      originalName: file.originalname,
      uuid: uniqueId,
    };

    cb(null, newFileName);
  },
});

const uploads = multer({
  storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

const storageSubmittals = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/submittalstemp"); // Folder to store files
  },
  filename: (req, file, cb) => {
    // Generate a UUID
    const uniqueId = uuidv4();
    // File's extension
    const fileExt = path.extname(file.originalname);
    // Set filename as UUID + file extension
    const newFileName = `${uniqueId}${fileExt}`;

    // Add file data to the object
    submittalsDataMap[newFileName] = {
      originalName: file.originalname,
      uuid: uniqueId,
    };

    cb(null, newFileName);
  },
});rfiDataMap

const submittalsUploads = multer({
  storage: storageSubmittals,
  fileFilter: (req, file, cb) => {
    // const allowedTypes = [
    //   "application/pdf",
    //   "image/jpeg",
    //   "image/png",
    //   "image/avif",
    // ];
    // if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
    // } else {
    //   cb(
    //     new Error(
    //       "Invalid file type. Only PDFs, JPEG, and PNG files are allowed."
    //     )
    //   );
    // }
  },
});

const storageRfi = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/rfitemp"); // Folder to store files
  },
  filename: (req, file, cb) => {
    // Generate a UUID
    const uniqueId = uuidv4();
    // File's extension
    const fileExt = path.extname(file.originalname);
    // Set filename as UUID + file extension
    const newFileName = `${uniqueId}${fileExt}`;

    // Add file data to the object
    rfiDataMap[newFileName] = {
      originalName: file.originalname,
      uuid: uniqueId,
    };

    cb(null, newFileName);
  },
});


const storageRfiResponse = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/rfiResponsetemp"); // Folder to store files
  },
  filename: (req, file, cb) => {
    // Generate a UUID
    const uniqueId = uuidv4();
    // File's extension
    const fileExt = path.extname(file.originalname);
    // Set filename as UUID + file extension
    const newFileName = `${uniqueId}${fileExt}`;

    // Add file data to the object
    rfiResponseDataMap[newFileName] = {
      originalName: file.originalname,
      uuid: uniqueId,
    };

    cb(null, newFileName);
  },
});

const  rfiResponseUploads = multer({
  storage: storageRfiResponse,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

const storageRfq = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/rfqtemp"); // Folder to store files
  },
  filename: (req, file, cb) => {
    // Generate a UUID
    const uniqueId = uuidv4();
    // File's extension
    const fileExt = path.extname(file.originalname);
    // Set filename as UUID + file extension
    const newFileName = `${uniqueId}${fileExt}`;

    // Add file data to the object
    rfqDataMap[newFileName] = {
      originalName: file.originalname,
      uuid: uniqueId,
    };

    cb(null, newFileName);
  },
});

const  rfqUploads = multer({
  storage: storageRfq,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});



const  rfiUploads = multer({
  storage: storageRfi,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

const storageFabricator = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/fabricatortemp"); // Folder to store files
  },
  filename: (req, file, cb) => {
    // Generate a UUID
    const uniqueId = uuidv4();
    // File's extension
    const fileExt = path.extname(file.originalname);
    // Set filename as UUID + file extension
    const newFileName = `${uniqueId}${fileExt}`;

    // Add file data to the object
    fabricatorDataMap[newFileName] = {
      originalName: file.originalname,
      uuid: uniqueId,
    };

    cb(null, newFileName);
  },
});

const fabricatorsUploads = multer({
  storage: storageFabricator,
  fileFilter: (req, file, cb) => {
    // const allowedTypes = [
    //   "application/pdf",
    //   "image/jpeg",
    //   "image/png",
    //   "image/avif",
    // ];
    // if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
    // } else {
    //   cb(
    //     new Error(
    //       "Invalid file type. Only PDFs, JPEG, and PNG files are allowed."
    //     )
    //   );
    // }
  },
});

const storageComment = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/commenttemp"); // Folder to store files
  },
  filename: (req, file, cb) => {
    // Generate a UUID
    const uniqueId = uuidv4();
    // File's extension
    const fileExt = path.extname(file.originalname);
    // Set filename as UUID + file extension
    const newFileName = `${uniqueId}${fileExt}`;

    // Add file data to the object
    commentDataMap[newFileName] = {
      originalName: file.originalname,
      uuid: uniqueId,
    };

    cb(null, newFileName);
  },
});

const commentUploads = multer({
  storage: storageComment,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

const storageChangeOrder = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/changeordertemp"); // Folder to store files
  },
  filename: (req, file, cb) => {
    // Generate a UUID
    const uniqueId = uuidv4();
    // File's extension
    const fileExt = path.extname(file.originalname);
    // Set filename as UUID + file extension
    const newFileName = `${uniqueId}${fileExt}`;

    // Add file data to the object
    changeOrderDataMap[newFileName] = {
      originalName: file.originalname,
      uuid: uniqueId,
    };

    cb(null, newFileName);
  },
});

const changeorderUploads = multer({
  storage: storageChangeOrder,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

const storageRfqResponse = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/rfqResponsetemp"); // Folder to store files
  },
  filename: (req, file, cb) => {
    // Generate a UUID
    const uniqueId = uuidv4();
    // File's extension
    const fileExt = path.extname(file.originalname);
    // Set filename as UUID + file extension
    const newFileName = `${uniqueId}${fileExt}`;

    // Add file data to the object
    rfqresponseDataMap[newFileName] = {
      originalName: file.originalname,
      uuid: uniqueId,
    };

    cb(null, newFileName);
  },
});

const rfqResponseUploads = multer({
  storage: storageRfqResponse,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});
// Export the uploader and file data object

const storageSubmittalsResponse = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/rfqResponsetemp"); // Folder to store files
  },
  filename: (req, file, cb) => {
    // Generate a UUID
    const uniqueId = uuidv4();
    // File's extension
    const fileExt = path.extname(file.originalname);
    // Set filename as UUID + file extension
    const newFileName = `${uniqueId}${fileExt}`;

    // Add file data to the object
    submittalResponseMap[newFileName] = {
      originalName: file.originalname,
      uuid: uniqueId,
    };

    cb(null, newFileName);
  },
});

const SubmittalsResponseUploads = multer({
  storage:storageSubmittalsResponse ,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});
const changeOrderTable = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/changeOrderTabletemp"); // Folder to store files
  },
  filename: (req, file, cb) => {
    // Generate a UUID
    const uniqueId = uuidv4();
    // File's extension
    const fileExt = path.extname(file.originalname);
    // Set filename as UUID + file extension
    const newFileName = `${uniqueId}${fileExt}`;

    // Add file data to the object
    submittalResponseMap[newFileName] = {
      originalName: file.originalname,
      uuid: uniqueId,
    };

    cb(null, newFileName);
  },
});

const changeOrderTableUploads = multer({
  storage:changeOrderTable ,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});


export {
  uploads,
  fileDataMap,
  fabricatorDataMap,
  fabricatorsUploads,
  rfiDataMap,
  rfiResponseDataMap,
  rfqresponseDataMap,
  changeOrderTableDataMap,
  rfiUploads,
  rfqDataMap,
  submittalResponseMap,
  rfqUploads,
  submittalsDataMap,
  submittalsUploads,
  commentUploads,
  commentDataMap,
  changeorderUploads,
  changeOrderDataMap,
  rfiResponseUploads,
  rfqResponseUploads,
  SubmittalsResponseUploads,
  changeOrderTableUploads
};
