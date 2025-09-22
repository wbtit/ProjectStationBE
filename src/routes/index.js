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
import RFQ from "./rfq/route.js"
import { Submittals } from "./submittals/route.js";
import WorkingHour from "./workinghours/route.js";
import { ChangeOrderRouter } from "./changeorder/route.js";
import { WorkBreakDown } from "./workbreakdown/route.js";
import WBSActivity from "./wbsactivity/route.js";
import { SubTasksRouter } from "./subtasks/route.js";
import {chatRouter}  from  "./chatSystem/route.js"
import  {File}       from   "./files/route.js"
import { dashBoardStats } from "./dashboardNumbers/route.js";
import {estimation} from "./estimation/route.js"
import { EstimationTask } from "./estimationTask/route.js";
import {estimationWH} from './estimationTaskWorkingHours/route.js'
import {Notes} from "./notes/route.js"
import {Meeting} from "./meeting/route.js"
import {MileStone} from "./mileStone/route.js";
import { EstimationLineItemGroupRoutes } from "./estLineItemGroups/route.js";

const routes = express.Router();

routes.use("/auth", Auth);
routes.use("/Client", Client);
routes.use("/department", Department);
routes.use("/fabricator", Fabricator);
routes.use("/project", Project);
routes.use("/task", Task);
routes.use("/team", Team);
routes.use("/employee", Employee);
routes.use("/RFI", RFI);
routes.use("/RFQ",RFQ)
routes.use("/Submittals", Submittals);
routes.use("/wh", WorkingHour);
routes.use("/co", ChangeOrderRouter);
routes.use("/br", WorkBreakDown);
routes.use("/wbs", WBSActivity);
routes.use("/st", SubTasksRouter);
routes.use("/chat",chatRouter)
routes.use("/File",File)
routes.use("/stats",dashBoardStats)
routes.use("/Estimation",estimation)
routes.use("/EstimationTask",EstimationTask)
routes.use("/EWH",estimationWH)
routes.use("/Note",Notes)
routes.use("/meetings",Meeting);
routes.use("/MileStone",MileStone)
routes.use("/lineItemGroup",EstimationLineItemGroupRoutes)

export { routes };
