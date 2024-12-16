import { Router } from "express";
import { addClient, updateClient } from "../../controllers/client.js";

const router = Router({ mergeParams: true });

router.post("/:fid/addclient", addClient); // Add Client

router.patch("/:cid/updateclient", updateClient); // Update Client By ID

export default router;
