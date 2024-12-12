import express from "express";
import Login from "./auth/login.js";
import SignUp from "./auth/signup.js";
import AddFabricator from "./fabricator/addfabricator.js";
import UpdateFabricator from "./fabricator/updatefabricator.js";
import DeleteFabricator from "./fabricator/deletefabricator.js";
import AddDepartment from "./departments/adddepartment.js";
import GetUer from "./auth/getuserbytoken.js";
import AddClient from "./client/addclient.js";
import AddbranchFab from "./fabricator/addbranch.js";
import GetAllFabricators from "./fabricator/getallfabricators.js";
import AddTeam from "./team/addteam.js";
import Team from "./team/team.js";
import Project from "./project/project.js";
import ResetPassword from "./auth/resetpassword.js";
import getAllDepartments from "./departments/getdepartments.js";
import AddTask from "./tasks/addtask.js"
import getAllTasks from '../routes/tasks/gettasks.js'
import updateTaskById from './tasks/updatetaskById.js'
import deleteTaskById from './tasks/deletetask.js'
import getTaskById from './tasks/getTaskById.js'
import patchUpdateById from './tasks/patchUpdateById.js'
import taskByIdAccept from './tasks/Accept/taskByIdAccept.js'
import updateTaskByIdAccept from './tasks/Accept/updateTaskByIdAccept.js'
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
routes.use("/addteam", AddTeam);
routes.use("/team", Team);
routes.use("/project", Project);
routes.use("/reset", ResetPassword);
routes.use("/getalldepartments", getAllDepartments);
routes.use('/addtask', AddTask)
routes.use('/tasks', getAllTasks)
routes.use('/tasksbyid', getTaskById)
routes.use('/tasksupdatebyid',updateTaskById )
routes.use('/deletetask',deleteTaskById )
routes.use('/updateTaskByid',patchUpdateById )
routes.use('/getTaskByidaccept',taskByIdAccept )
routes.use('/updateTaskByidaccept',updateTaskByIdAccept )

export { routes };
