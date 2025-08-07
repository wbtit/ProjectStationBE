import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";


// CREATE a note
const createNote = async (req, res) => {
  try {
    const { content, stage,projectId } = req.body;

    if(!content||!stage||!projectId){
        return sendResponse({
        message: "Fields are empty",
        res,
        statusCode: 400,
        success: false,
        data: null,
    });
    }
    const fileDetails = req.files.map((file) => ({
      filename: file.filename, // UUID + extension
      originalName: file.originalname, // Original name of the file
      id: file.filename.split(".")[0], // Extract UUID from the filename
      path: `/public/notesTemp/${file.filename}`, // Relative path
    }));
    const note = await prisma.notes.create({
      data: {
        content,
        stage,
        projectId,
        files:fileDetails
      },
    });

    return sendResponse({
        message: "notes created successfully",
        res,
        statusCode: 200,
        success: true,
        data: note,
    });
  } catch (error) {
    console.error('Create Note Error:', error);
    return sendResponse({
        message:error.message,
        res,
        statusCode:500,
        success:false,
        data:null
    });
  }
};

// READ all notes (optionally filtered by projectId)
const getAllNotes = async (req, res) => {
  try {
    const { projectId } = req.params;

    const notes = await prisma.notes.findMany({
      where: projectId ? { projectId } : {},
      orderBy: { createdAt: 'desc' },
    });

    return sendResponse({
        message: "notes created successfully",
        res,
        statusCode: 200,
        success: true,
        data: notes,
    });
  } catch (error) {
    console.error('Get Notes Error:', error);
    return sendResponse({
        message:error.message,
        res,
        statusCode:500,
        success:false,
        data:null
    });
  }
};

// READ single note by ID
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.notes.findUnique({
      where: { id },
    });

    if (!note) {
      return sendResponse({
        message:"Notes not found for the above ID",
        res,
        statusCode:400,
        success:false,
        data:null
    });
    }

    return sendResponse({
        message: "note fetched successfully",
        res,
        statusCode: 200,
        success: true,
        data: note,
    });
  } catch (error) {
    console.error('Get Note Error:', error);
    return sendResponse({
        message:error.message,
        res,
        statusCode:500,
        success:false,
        data:null
    });
  }
};

// UPDATE note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, stage } = req.body;

    const note = await prisma.notes.update({
      where: { id },
      data: {
        content,
        stage,
      },
    });

    return sendResponse({
        message: "note updated successfully",
        res,
        statusCode: 200,
        success: true,
        data: note,
    });
  } catch (error) {
    console.error('Update Note Error:', error);
    return sendResponse({
        message:error.message,
        res,
        statusCode:500,
        success:false,
        data:null
    });
  }
};

// DELETE note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note =await prisma.notes.delete({
      where: { id },
    });

    return sendResponse({
        message: "note deleted successfully",
        res,
        statusCode: 200,
        success: true,
        data: note,
    });
  } catch (error) {
    console.error('Delete Note Error:', error);
    return sendResponse({
        message:error.message,
        res,
        statusCode:500,
        success:false,
        data:null
    });
  }
};



const getNotesByProjectId= async(req,res)=>{
    const {projectId}=req.params
    try {
        if(!projectId){
        return sendResponse({
            message:"ProjectId is required",
            res,
            statusCode:400,
            success:false,
            data:null
        })
    }
    const notes = await prisma.notes.findMany({
        where:{projectId:projectId}
    })
    return sendResponse({
        message:"Notes fetched successfully",
        res,
        statusCode:200,
        success:true,
        data:notes
        
    })
    } catch (error) {
      console.log(error.message)
      return sendResponse({
        message:error.message,
        res,
        statusCode:500,
        data:null
      })  
    }
}
export{
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  getNotesByProjectId
};
