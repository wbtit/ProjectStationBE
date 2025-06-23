import prisma from "../lib/prismajs";
import { sendResponse } from "../utils/responder.js";

const createTemplate=async(req,res)=>{
    const{estimationId}=req.params
    const{
      detailingEstimatedHours,
      detailingEstimatedPrice,
      detailingEstimatedWeeks,
      connectionDesignRequired,
      scopeSheetAvailable,
      steelConsidered,
      connectionDesignMainSteel,
      connectionDesignMiscSteel,
      peStampingIncluded,
      exclusionNotes  
    }=req.body
}