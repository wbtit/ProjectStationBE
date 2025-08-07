import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { notesUploads} from "../../config/multer.js";

import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  getNotesByProjectId
} from '../../controllers/notes.js'

const router= Router();

router.post("/addNote",notesUploads.array("files"),Authenticate,createNote)
router.get("/All",Authenticate,getAllNotes)
router.get("/:id",Authenticate,getNoteById)
router.patch("/update/:id",Authenticate,updateNote)
router.delete("/:id",Authenticate,deleteNote)
router.get("/:projectId",Authenticate,getNotesByProjectId)

export{router as Notes};