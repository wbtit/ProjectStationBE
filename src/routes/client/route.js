import { Router } from "express";
import { addClient, updateClient,deleteClient,getAllClients } from "../../controllers/client.js";

const router = Router({ mergeParams: true });

router.post("/:fid/addclient", addClient); // Add Client

router.patch("/:cid/updateclient", updateClient); // Update Client By ID

router.delete("/:cid/deletClient",deleteClient)//dele client by ID
router.get("/getallclients",getAllClients)

export default router;