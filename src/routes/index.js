import express from "express";
import Login from "./auth/login.js";
import SignUp from "./auth/signup.js";
import AddFabricator from "./fabricator/addfabricator.js";
import UpdateFabricator from "./fabricator/updatefabricator.js";
import DeleteFabricator from "./fabricator/deletefabricator.js";
import AddDepartment from "./departments/adddepartment.js";
import GetUer from "./auth/getuserbytoken.js";
import AddClient from "./client/addclient.js"
import AddbranchFab from "./fabricator/addbranch.js";
import GetAllFabricators from "./fabricator/getallfabricators.js";

const routes = express.Router();

routes.use("/login", Login);
routes.use("/signup", SignUp);
routes.use("/addfabricator", AddFabricator);
routes.use("/updatefabricator", UpdateFabricator);
routes.use("/deletefabricator", DeleteFabricator);
routes.use("/adddepartment", AddDepartment);
routes.use("/token", GetUer);
routes.use("/addclient", AddClient);
routes.use("/addbranchfab", AddbranchFab);
routes.use("/fabricators", GetAllFabricators);

export { routes };
