import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const fileDataMap = {}; // Object to store file data (UUID and original name)

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
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/avif",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDFs, JPEG, and PNG files are allowed."
        )
      );
    }
  },
});

// Export the uploader and file data object
export { uploads, fileDataMap };
