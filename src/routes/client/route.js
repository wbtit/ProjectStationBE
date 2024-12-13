import { Router } from "express";
import { addClient, updateClient } from "../../controllers/client.js";

const router = Router({ mergeParams: true });

router.post("/:fid/addclient", addClient);
router.patch("/:cid/updateclient", updateClient);

export default router;
