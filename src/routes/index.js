import express from "express";
import Auth from "./auth/route.js";
import Client from "./client/route.js";
import Department from "./departments/route.js";
import Fabricator from "./fabricator/route.js";
import Project from "./project/route.js";
import Task from "./tasks/route.js";
import Team from "./team/route.js";
import Employee from "./employee/route.js";
import RFI from "./rfi/route.js";
import { Submittals } from "./submittals/route.js";
import Notifications from "./notifications/routes.js";
import WorkingHour from "./workinghours/route.js";
import { ChangeOrderRouter } from "./changeorder/route.js";

const routes = express.Router();

routes.use("/auth", Auth);
routes.use("/client", Client);
routes.use("/department", Department);
routes.use("/fabricator", Fabricator);
routes.use("/project", Project);
routes.use("/task", Task);
routes.use("/team", Team);
routes.use("/employee", Employee);
routes.use("/RFI", RFI);
routes.use("/submittals", Submittals);
routes.use("/notifications", Notifications);
routes.use("/wh", WorkingHour);
routes.use("/co", ChangeOrderRouter);

export { routes };
