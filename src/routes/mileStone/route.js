import {Router} from "express";
import Authenticate from "../../middlewares/authenticate.js";
import {
  createMileStone,
  getMileStoneById,
  getAllMileStones,
  updateMileStone,
  deleteMileStone,
  getMileStonesByProject
} from "../../controllers/mileStone.js";

const router = Router();

router.post("/add/:projectId/:fabricatorId", Authenticate, createMileStone);
router.get("/all", Authenticate, getAllMileStones);
router.get("/:id", Authenticate, getMileStoneById);
router.patch("/update/:id", Authenticate, updateMileStone);
router.delete("/delete/:id", Authenticate, deleteMileStone);
router.get("/project/:projectId", Authenticate, getMileStonesByProject);

export { router as MileStone };