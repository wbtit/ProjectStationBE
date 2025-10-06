import { createDesignDrawing,
  getDesignDrawingsByProject,
  updateDesignDrawingStage,
  getResponse,
  addDesignDrawingResponse,
  getAllDesignDrawings,
  deleteDesignDrawing,
  viewDesignDrawingResponseFiles,
 } from "../../controllers/designDrawing.js";
import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { designDrawingUploads, designDrawingResponseUploads } from "../../config/multer.js";

const router = Router();

router.post(
  "/designdrawing/add/:projectId",
  Authenticate,
  designDrawingUploads.array("files"),
  createDesignDrawing
);

router.get(
  "/designdrawing/viewfile/:id/:fid",
  viewDesignDrawingResponseFiles
);

router.get(
  "/designdrawing/project/:projectId",
  Authenticate,
  getDesignDrawingsByProject
);

router.patch(
  "/designdrawing/:id/updatestage",
  Authenticate,
  updateDesignDrawingStage
);

router.post(
  "/designdrawing/addResponse/:designDrawingId",
  Authenticate,
  designDrawingResponseUploads.array("files"),
  addDesignDrawingResponse
);

router.get(
  "/designdrawing/getResponse/:id",
  Authenticate,
  getResponse
);

router.get(
  "/designdrawing/getAll",
  Authenticate,
  getAllDesignDrawings
);
router.delete(
  "/designdrawing/:id",
  Authenticate,
  deleteDesignDrawing
);

export {router as DesignDrawings};