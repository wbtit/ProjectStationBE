import express from "express";
import Auth from "./auth/route.js";
import Client from "./client/route.js";
import Department from "./departments/route.js";
import Fabricator from "./fabricator/route.js";
import Project from "./project/route.js";
import Task from "./tasks/route.js";
import Team from "./team/route.js";
import Employee from "./employee/route.js";

const routes = express.Router();

routes.use("/auth", Auth);
routes.use("/client", Client);
routes.use("/department", Department);
routes.use("/fabricator", Fabricator);
routes.use("/project", Project);
routes.use("/task", Task);
routes.use("/team", Team);
routes.use("/employe", Employee);

export { routes };
