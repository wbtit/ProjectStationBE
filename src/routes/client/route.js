import { Router } from "express";
import { addClient, updateClient,deleteClient,getAllClients } from "../../controllers/client.js";

const router = Router({ mergeParams: true });

router.post("/client/:fid/addclient", addClient); // Add Client

router.patch("/cleint/:cid/updateclient", updateClient); // Update Client By ID

router.delete("/cleint/:cid/deletClient",deleteClient)//dele client by ID

router.get("/client/getallclients",getAllClients)//get Clients

export default router;