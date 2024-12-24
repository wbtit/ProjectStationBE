import { Router } from "express";
import {
  addClient,
  updateClient,
  deleteClient,
  getAllClients,
  GetClientBYID,
  
} from "../../controllers/client.js";
import { ClientAccess } from "../../middlewares/clientaccess.js";
import Authenticate from "../../middlewares/authenticate.js";

const router = Router({ mergeParams: true });

router.post("/client/:fid/addclient", Authenticate, ClientAccess, addClient); // Add Client

router.patch(
  "/cleint/:cid/updateclient",
  Authenticate,
  ClientAccess,
  updateClient
); // Update Client By ID

router.delete(
  "/cleint/:cid/deletClient",
  Authenticate,
  ClientAccess,
  deleteClient
); //dele client by ID

router.get("/client/getallclients", Authenticate, ClientAccess, getAllClients); //get Clients

router.get("/client/:cid", Authenticate, ClientAccess, GetClientBYID); // Get clinet by IDj

export default router;
