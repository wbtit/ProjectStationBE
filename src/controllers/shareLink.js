import crypto from "crypto";    
import prisma from "../lib/prisma.js"; 
import { sendResponse } from "../utils/responder.js";
import mime from "mime";
import fs from "fs";
import path from "path";




// maps API table names to prisma model names

const MODEL_MAP = {
  notes: "notes",
  project: "project",
  meeting:"meeting",
  fabricator:"fabricator",
  designDrawings:"designDrawings",
  designDrawingsResponses:"designDrawingsResponses",
  submittals:"submittals",
  submittalsResponse:"submittalsResponse",
  rFI:"rFI",
  rFIResponse:"rFIResponse",
  rFQ:"rFQ",
  rFQResponse:"rFQResponse",
  changeOrders:"changeOrders",
  cOResponse:"cOResponse",
  estimation:"estimation",
};

const createShareLink = async (req, res) => {
  try {
    const { table, parentId, fileId } = req.params;

    const modelName = MODEL_MAP[table];
    if (!modelName) {
      return res.status(400).json({ message: "Invalid table" });
    }

    // fetch parent row
    const row = await prisma[modelName].findUnique({
      where: { id: parentId }
    });

    if (!row) return res.status(404).json({ message: "Record not found" });

    const files = row.files || [];

    const fileObj = files.find(f => f.id === fileId);

    if (!fileObj) {
      return res.status(404).json({ message: "File not found in JSON" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    // const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24hr
    const expiresAt = null; // never expire
    
    const share = await prisma.fileShareLink.create({
      data: {
        token,
        parentTable: table,
        parentId,
        fileId,
        expiresAt,
      },
    });
    const shareUrl = `${process.env.APP_BASE_URL}/api/share/${token}`;

    return sendResponse({
        res,
        statusCode: 200,
        success: true,
        message: "Share link created successfully",
        data: { shareUrl, expiresAt },
      });
  } catch (err) {
    console.error("Create Share Link Error:", err);
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};


const downloadShare = async (req, res) => {
  try {
    const { token } = req.params;

    // lookup token in db
    const share = await prisma.fileShareLink.findUnique({
      where: { token }
    });

    if (!share) {
      return res.status(404).json({ message: "Invalid link" });
    }

    if (share.expiresAt && share.expiresAt < new Date()) {
      return res.status(410).json({ message: "Link expired" });
    }

    const modelName = MODEL_MAP[share.parentTable];
    if (!modelName) {
      return res.status(400).json({ message: "Invalid table in link" });
    }

    // fetch parent row
    const row = await prisma[modelName].findUnique({
      where: { id: share.parentId },
    });

    if (!row) {
      return res.status(404).json({ message: "Parent record not found" });
    }

    const file = (row.files || []).find(f => f.id === share.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found in record" });
    }

    // build path
    const root = process.env.PUBLIC_DIR || path.join(__dirname, "..", "..", "public");
    const filePath = path.join(root, file.path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File missing on server" });
    }

    const mimeType = mime.getType(filePath) || "application/octet-stream";

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${file.originalName}"`);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      res.status(500).json({ message: "Error reading file" });
    });

  } catch (err) {
    console.error("Share Download Error:", err);
    return res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

export { createShareLink, downloadShare };