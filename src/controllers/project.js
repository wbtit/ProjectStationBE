// Please navigate to very bottom of the file to know the logics in this file.

import { sendResponse } from "../utils/responder.js";
import { v4 as uuidv4 } from "uuid";
import prisma from "../lib/prisma.js";
import { isValidUUID } from "../utils/isValiduuid.js";
import path from "path";
import fs from "fs";
// import client from "../redis/index.js";
import mime from "mime";
import { fetchTeamDetails } from "../models/getTeamMemberDetails.js"
import { sendNotification } from "../utils/notify.js";
import cloneWBSAndSubtasks from "../utils/cloneWBSAndSubTasks.js";

import { fileURLToPath } from "url";

// Recreate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AddProject = async (req, res) => {
  const {
    name,
    description,
    fabricator,
    department,
    manager,
    clientId,
    status,
    team,
    stage,
    tools,
    connectionDesign,
    miscDesign,
    customer,
    start_date,
    end_date,
    approvalDate,
    estimatedHours,
    modelingHours,
    modelCheckingHours,
    detailingHours,
    detailCheckingHours,
    erectionHours,
    erectionCheckingHours,
    detailingMain,
    detailingMisc,
    rfqId,
    projectNumber
  } = req.body;

  // console.log(req.body);

  if (
    !name ||
    !description ||
    !fabricator ||
    !department ||
    !manager ||
    !start_date ||
    !approvalDate 
    // !modelingHours||
    // !modelCheckingHours||
    // !detailingHours||
    // !detailCheckingHours||
    // !erectionHours||
    // !erectionCheckingHours
  ) {
    return sendResponse({
      message: "Fields are empty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const project = await prisma.project.create({
      data: {
        description: description,
        estimatedHours: parseInt(estimatedHours)||"",
        name: name,
        approvalDate: approvalDate,
        connectionDesign: connectionDesign,
        detailingMain,
        detailingMisc,
        projectNumber: projectNumber ||null,
        rfqId: rfqId || null,
        customerDesign: customer,
        departmentID: department,
        fabricatorID: fabricator,
        clientId:clientId||null,
        managerID: manager,
        miscDesign: miscDesign,
        stage: stage || 'IFA',
        startDate: start_date,
        teamID: team || null,
        status: status,
        tools: tools,
        endDate: end_date,
        modelingHours,
        modelCheckingHours,
        detailingHours,
        detailCheckingHours,
        erectionHours,
        erectionCheckingHours
      },
    });
    const fabricatorData= await prisma.fabricator.findUnique({
      where:{id:fabricator},
      include:{
        userss:true
      }
    })
// RLT notification
    if(fabricatorData && fabricatorData.userss?.length){
      fabricatorData.userss.forEach((client)=>{
        sendNotification(client.id,{
          message:`A New Project "${project.name}" has been created.`,
        })
      })
    }
    // console.log("THe 20th data", SubTasks[20]);

      console.log(`Creating WBS activities and subtasks for initial stage: ${project.stage}.`);
    await cloneWBSAndSubtasks(project.id, project.stage, prisma);

    // console.log(project);

    return sendResponse({
      message: "Project created successfully",
      res,
      statusCode: 200,
      success: true,
      data: {
        project,
      },
    });
  } catch (error) {
    console.log(error.message);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const Uploadfiles = async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return sendResponse({
      message: "Invalid Project",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    // Check if files are provided
    if (!req.files || req.files.length === 0) {
      return sendResponse({
        message: "No files uploaded",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const fileDetails = req.files.map((file) => ({
    filename: file.filename,             // UUID.ext
    originalName: file.originalname,     // Original file name
    id: file.filename.split(".")[0],     // UUID
    path: `projecttemp/${file.filename}`, // relative URL
  }));


    // Fetch the project
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return sendResponse({
        message: "Invalid Project ID",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    // Merge existing files with the new file details
    const updatedFiles = [...(project.files || []), ...fileDetails];

    // Update the project with new files array
    const updatedFilesProject = await prisma.project.update({
      where: { id },
      data: {
        files: updatedFiles,
      },
    });


    return sendResponse({
      message: "Files Upload Complete",
      res,
      statusCode: 200,
      success: true,
      data: updatedFilesProject,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return sendResponse({
      message: error?.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const UpdateProject = async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return sendResponse({
      message: "Invalid IDs",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

   console.log(req.body);

  req.body = { ...req.body, fabricator: null };

  try {
    if (req.body.fabricator) {
      // Check whether the ID is a fabricator ID
      const fabricator = await prisma.fabricator.findUnique({
        where: {
          id: req.body.fabricator,
        },
      });
      // if (!fabricator) {
      //   return sendResponse({
      //     message: "Invalid Fabricator",
      //     res,
      //     statusCode: 400,
      //     success: false,
      //     data: null,
      //   });
      // }
    }

    if (req.body.department) {
      // Check whether such department exists
      const department = await prisma.department.findUnique({
        where: {
          id: req.body.department,
        },
      });
      if (!department) {
        return sendResponse({
          message: "Invalid Department",
          res,
          statusCode: 400,
          success: false,
          data: null,
        });
      }
    }

    if (req.body.team) {
      // Check whether such team exists
      const team = await prisma.team.findUnique({
        where: {
          id: req.body.team,
        },
      });
      if (!team) {
        return sendResponse({
          message: "Invalid Team",
          res,
          statusCode: 400,
          success: 400,
          data: null,
        });
      }
    }

    if (req.body.managerID) {
      // Check the provided user ID is a manager or not
      const { is_manager } = await prisma.users.findUnique({
        where: {
          id: req.body.managerID,
        },
        select: {
          is_manager: true,
        },
      });

      if (!is_manager)
        return sendResponse({
          message: "Invalid Manager or The user is not a manager",
          res,
          statusCode: 400,
          success: false,
          data: null,
        });
    }

    const updateData = {};
    const fieldsToUpdate = [
      "name",
      "fabricator",
      "description",
      "duration",
      "startDate",
      "endDate",
      "endDateChangeLog",
      "approvalDateChangeLog",
      "status",
      "stage",
      "managerID",
      "team",
      "approvalDate",
      "estimatedHours",
      "modelingHours",
      "modelCheckingHours",
      "detailingHours",
      "detailCheckingHours",
      "erectionHours",
      "erectionCheckingHours",
      "mailReminder",
      "submissionMailReminder",
      "detailingMain",
      "detailingMisc"
    ];

    fieldsToUpdate.forEach((field) => {
      if (
  req.body[field] !== null &&
  req.body[field] !== undefined &&
  req.body[field] !== ""
) {
  if (["startDate", "endDate", "approvalDate"].includes(field)) {
    updateData[field] = new Date(req.body[field]).toISOString(); // ✅ Convert to ISO string
  } else {
    updateData[field] = req.body[field];
  }
}

    });
    // console.log(updateData);
    const previousProjectStage= await prisma.project.findUnique({
      where:{id:id},
      select:{
        stage:true,
        approvalDate:true,
        endDate:true,
        mailReminder:true,
        submissionMailReminder:true,
        endDateChangeLog:true,
        approvalDateChangeLog:true
      }
    })

    if(req.body.stage && req.body.stage !== previousProjectStage.stage){
      await prisma.projectStageHistory.updateMany({
        where:{
          projectID:id,
          endDate:null
        },
        data:{
          endDate:new Date()
        }
      })

      await prisma.projectStageHistory.create({
        data:{
          projectID:id,
          stage:updateData.stage,
          startDate: new Date()
        }
      })
      updateData.stage=req.body.stage
    }
    //Reset
    if(req.body.approvalDate && new Date(req.body.approvalDate).toDateString()!==new Date(previousProjectStage.approvalDate).toDateString()){
      fieldsToUpdate.approvalDate= new Date(req.body.approvalDate).toISOString()
      updateData.mailReminder= false
    }else if (req.body.approvalDate) {
            // If date is provided but not changed, ensure it's still a Date object
            updateData.approvalDate = new Date(req.body.approvalDate).toISOString();
        }


    //Reset
    if(req.body.endDate && new Date(req.body.endDate).toDateString()!==new Date(previousProjectStage.endDate).toDateString()){
      fieldsToUpdate.endDate= new Date(req.body.endDate).toISOString()
      updateData.submissionMailReminder= false
    }else if (req.body.endDate) {
            // If date is provided but not changed, ensure it's still a Date object
            updateData.endDate = new Date(req.body.endDate).toISOString();
    }


    if(req.body.endDate && req.body.endDate!== previousProjectStage.endDate){
      const existingLog=previousProjectStage.endDateChangeLog || [];

      const newLogEntry={
        oldEndDate:previousProjectStage.endDate,
        newEndDate:updateData.endDate,
        changetAt: new Date().toISOString()
      }
      updateData.endDate=req.body.endDate;
      updateData.endDateChangeLog=[...existingLog,newLogEntry]
    }
    if(req.body.approvalDate && req.body.approvalDate!== previousProjectStage.approvalDate){
      const existingLog = previousProjectStage.approvalDateChangeLog ||[];

      const newLogEntry={
         oldApprovalDate:previousProjectStage.approvalDate,
        newApprovalDate:updateData.approvalDate,
        changetAt: new Date().toISOString()
      }
      updateData.approvalDate=req.body.approvalDate;
      updateData.approvalDateChangeLog=[...existingLog,newLogEntry]
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: id,
      },
      data: updateData, // req.body must contains only fields present in the project schema
    });

    if(req.body.stage && req.body.stage !== previousProjectStage.stage){
      console.log(`Project stage changed from ${previousProjectStage.stage} to ${req.body.stage}. Cloning WBS activities and subtasks.`);
      await cloneWBSAndSubtasks(updatedProject.id, updatedProject.stage);
    }
    return sendResponse({
      message: "Project Update Successfully",
      res,
      statusCode: 200,
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    console.log(error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  } finally {
    await prisma.$disconnect();
  }
};

const GetAllProjects = async (req, res) => {
  try {
    // console.log("User Data:", req.user);

    const { is_manager, is_staff, is_superuser, role, fabricatorId, id ,is_hr,is_sales,is_est,is_supermanager,is_systemadmin} = req.user;
    let projects;

    // 🔹 Superuser: Fetch all projects
    if (is_superuser|| is_hr ||is_supermanager||is_systemadmin) {
      projects = await prisma.project.findMany({
        include: {
          stageHistory:true,
          rfi:true,
          file:true,
          fabricator: true,
          tasks:{
            include:{
              mileStone:{select:{description:true,subject:true,stage:true,status:true}}
            }},
          manager: { select: { f_name: true, l_name: true } },
          team: { select: { name: true, members: true } },
          department: {
            select: { name: true, manager: { select: { f_name: true, l_name: true } } },
          },
        },
      });
     }//else if (is_sales){
    //   const fabs = await prisma.fabricator.findMany({
    //     where:{createdById:req.user.id},
    //     include:{
    //       project:true
    //     }
    //   })
    //   projects=fabs.map(f=>f.project)
    //   console.log("The projects for the sales",projects)
    // }
    // 🔹 Client: Fetch only their fabricator's projects
    else if (role === "CLIENT") {
      // console.log("Client access granted.");
      projects = await prisma.project.findMany({
        where: { fabricatorID: fabricatorId },
        include: {
          submittals:{
            include:{
              mileStoneBelongsTo:true
            }
          },
          stageHistory:true,
          fabricator: true,
          tasks:{
            include:{
              mileStone:{select:{description:true,subject:true,stage:true,status:true}}
            }
          },
          team:true,
          changeOrder:true,
          manager: { select: { f_name: true, l_name: true } },
          team: { select: { name: true, members: true } },
          department: {
            select: { name: true, manager: { select: { f_name: true, l_name: true } } },
          },
          file:true
        },
      });
    }
    // 🔹 Department Manager: Fetch projects belonging to their department
    else if (is_manager && is_staff) {
      // console.log("Department Manager access granted.");
      projects = await prisma.project.findMany({
        where: { 
          department: { manager: { id } }  // ✅ Fixed reference to department manager
        },
        include: {
          tasks:{include:{mileStone:{select:{description:true,subject:true,stage:true,status:true}}}},
          stageHistory:true,
          fabricator: true,
          manager: { select: { f_name: true, l_name: true } },
          team: { select: { name: true, members: true } },
          department: {
            select: { name: true, manager: { select: { f_name: true, l_name: true } } },
          },
          
          file:true,
          
        },
      });
    }
    // 🔹 Regular Manager: Fetch projects they are managing
    else if (is_manager) {
      // console.log("Project Manager access granted.");
      projects = await prisma.project.findMany({
        where: { managerID: id },
        include: {
           tasks:{include:{mileStone:{select:{description:true,subject:true,stage:true,status:true}}}},
          stageHistory:true,
          fabricator: true,
          manager: { select: { f_name: true, l_name: true } },
          team: { select: { name: true, members: true } },
          department: {
            select: { name: true, manager: { select: { f_name: true, l_name: true } } },
          },
          file:true
        },
      });
    }
    // 🔹 Staff: Fetch projects where they have tasks assigned
    else if (is_staff||is_est) {
      // console.log("Staff access granted.");
      projects = await prisma.project.findMany({
        where: { tasks: { some: { user_id: id } } },
        include: {
          tasks:{include:{mileStone:{select:{description:true,subject:true,stage:true,status:true}}}},
          stageHistory:true,
          fabricator: true,
          manager: { select: { f_name: true, l_name: true } },
          team: { select: { name: true, members: true } },
          department: {
            select: { name: true, manager: { select: { f_name: true, l_name: true } } },
          },
          file:true
        },
      });
    }
    // 🔹 Team Members: Fetch projects where they are in a team
    else {
      // console.log("Fetching projects for a team member.");

      const teams = await prisma.team.findMany({
        where: { members: { some: { id } } },
        select: { projectId: true },
      });

      const projectIds = teams.map((team) => team.projectId);

      if (projectIds.length > 0) {  // ✅ Prevents querying with an empty array
        projects = await prisma.project.findMany({
          where: { id: { in: projectIds } },
          include: {
             tasks:{include:{mileStone:{select:{description:true,subject:true,stage:true,status:true}}}},
            fabricator: true,
            stageHistory:true,
            manager: { select: { f_name: true, l_name: true } },
            team: { select: { name: true, members: true } },
            department: {
              select: { name: true, manager: { select: { f_name: true, l_name: true } } },
            },
          },
          file:true
        });
      } else {
        projects = [];
      }
    }

    // console.log("Projects Retrieved:", projects.length);
    return sendResponse({
      message: "Projects retrieved successfully",
      res,
      statusCode: 200,
      success: true,
      data: projects,
    });

  } catch (error) {
    console.error("Error:", error.message);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};


const GetProjectByID = async (req, res) => {
  const { id } = req.params;


  if (!isValidUUID(id)) {
    return sendResponse({
      message: "Invalid ID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }


  try {
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        team: {
          include: {
            manager: true,
          },
        },
        
        stageHistory:true,
        department: true,
        fabricator: true,
        manager: true,
        tasks:{include:{mileStone:{select:{description:true,subject:true,stage:true,status:true}}}},
        accepttasks: true,
        file:true,
        changeOrder:true,
        rfi:true,
        submittals:true
      },
    });


    const ids = project.team.members.map((mem) => mem.id);


    const data = await fetchTeamDetails({ ids });


    const Data = project.team.members.map((m) => {
      return { ...data[m.id], role: m.role };
    });


    return sendResponse({
      message: "Project Retrived Successfully",
      res,
      statusCode: 200,
      success: true,
      data: {
        ...project,
        team: {
          ...project.team,
          members: Data,
        },
      },
    });
  } catch (error) {
    console.log("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrror",error.message);
    return sendResponse({
      message: "Something went wrong",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};



const GetAllfiles = async (req, res) => {
  try {
    const files = await prisma.project.findMany({
      select: {
        files: true,
      },
    });

    return sendResponse({
      message: "Fetched All Files",
      res,
      statusCode: 200,
      success: 200,
      data: files,
    });
  } catch (error) {
    return sendResponse({
      message: "Something went wrong",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const GetAllFilesByProjectID = async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return sendResponse({
      message: "Invalid ID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const { files } = await prisma.project.findUnique({
      where: {
        id,
      },
      select: {
        files: true,
      },
    });

    return sendResponse({
      message: "Fetched files successfully",
      res,
      statusCode: 200,
      success: true,
      data: files,
    });
  } catch (error) {
    // console.log(error.message);
    return sendResponse({
      message: "Something went wrong",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const DownloadFile = async (req, res) => {
  const { id, fid } = req.params; // id: Project ID, fid: File UUID

  try {
    // Fetch project to access the files array
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Find the file in the project's files array using the file UUID (fid)
    const fileObject = project.files.find((file) => file.id === fid);

    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

    // Construct the file path using __dirname
    const __dirname = path.resolve(); // Get the absolute path of the current directory
    const filePath = path.join(__dirname, fileObject.path);

    // console.log("Firnam", __dirname);

    // console.log("File path:", filePath);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // console.log("FO", fileObject);

    // Initiate file download
    res.download(filePath, fileObject.originalName, (err) => {
      if (err) {
        console.error("File Download Error:", err);
        return res
          .status(500)
          .json({ message: "Error occurred while downloading the file" });
      }
    });
  } catch (error) {
    console.error("Download File Error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong while downloading the file" });
  }
};

const ViewFile = async (req, res) => {
  const { id, fid } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id:id}, // Use parseInt if 'id' is numeric
     
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const fileObject = project.files.find((file) => file.id === fid);

    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

  // 3. Construct safe absolute path
   const projectRoot = path.join(__dirname, "..", "..", "public");

   const safePath = path.join(projectRoot, fileObject.path);

    if (!fs.existsSync(safePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    const fileExt = path.extname(safePath).toLowerCase();
    const mimeType = mime.getType(safePath) || "application/octet-stream";

    // Special handling for .zip files
    if (fileExt === '.zip') {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileObject.originalName}"`
      );
    } else {
      res.setHeader("Content-Type", mimeType);
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${fileObject.originalName}"`
      );
    }

    // 6. Stream file to client
    const fileStream = fs.createReadStream(safePath);
    fileStream.pipe(res);

    fileStream.on("error", (err) => {
      console.error("File stream error:", err);
      res.status(500).json({ message: "Error reading file" });
    });
  } catch (error) {
    console.error("View File Error:", error); 
    return res.status(500).json({
      message: "Something went wrong while viewing the file",
      error: error.message,
    });
  }
};

const getProjectsByUser = async (req, res) => {
  try {
    const { id } = req.user;

    // Fetch tasks for a specific user
    const tasks = await prisma.task.findMany({
      where: {
        user_id: id, // Filter tasks by user_id
      },
      include: {
        project: true, // Include the related project details
      },
    });

    // Extract project details from tasks
    const projectDetails = tasks.map((task) => task.project);

    // Return unique project details (to avoid duplicates)
    const uniqueProjects = [...new Set(projectDetails.map((p) => p.id))].map(
      (id) => projectDetails.find((p) => p.id === id)
    );

    // console.log("Pros", uniqueProjects);

    return res.json(uniqueProjects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteProjectById=async(req,res)=>{
  const {pid}=req.params
  try {
    if(!pid){
      return sendResponse({
        message:"Missing ProjectID ",
        res,
        statusCode:400,
        success:false,
        data:null
      })
    }

    const deletedProject= await prisma.project.delete({
      where:{
        id:pid
      }
    })
    if(!deleteProjectById){
      return sendResponse({
        message:"Failed to delete the Project",
        res,
        statusCode:400,
        success:false,
        data:null
      })
    }
    return sendResponse({
      message:"Project got deleted successfully",
      res,
      statusCode:200,
      success:true,
      data:null
    })
  } catch (error) {
    return sendResponse({
      message:error.message,
      res,
      statusCode:500,
      success:false,
      data:null
    })
  }
}
const getTaskStatusCountsByStage = async (req, res) => {
  const { projectId } = req.params;

  try {
    // Step 1: Group tasks by Stage and Status
    const grouped = await prisma.task.groupBy({
      by: ['Stage', 'status'],
      where: {
        project_id: projectId,
        status: {
          in: ['COMPLETE', 'ASSIGNED'],
        },
      },
      _count: {
        _all: true,
      },
    });

    // Step 2: Prepare result map with all stages initialized
    const result = {};

    // Initialize all stages
    const Stage={
      RFI,
      IFA,
      BFA,
      BFAM,
      RIFA,
      RBFA,
      IFC,
      BFC,
      RIFC,
      REV,
      CO,
      COMPLETED,
      REWORK,
      KICKOFF,
    }

    for (const stage of Object.values(Stage)) {
      result[stage] = { COMPLETE: 0, ASSIGNED: 0 };
    }

    // Fill counts based on grouped results
    for (const entry of grouped) {
      const { Stage: stage, status, _count } = entry;
      if (status === 'COMPLETE' || status === 'ASSIGNED') {
        result[stage][status] = _count._all;
      }
    }

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Error fetching task counts by stage and status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


export {
  AddProject,
  Uploadfiles,
  UpdateProject,
  GetAllProjects,
  GetProjectByID,
  GetAllFilesByProjectID,
  GetAllfiles,
  DownloadFile,
  ViewFile,
  getProjectsByUser,
  deleteProjectById,
  getTaskStatusCountsByStage
};
