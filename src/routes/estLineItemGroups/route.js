import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { createLineItemGroup,getLineItemGroups,
  getLineItemGroupById,
  updateLineItemGroup,
  deleteLineItemGroup } from "../../controllers/estimationLineItemsGroups.js";

const router = Router();

// Create a LineItemGroup for an Estimation
router.post(
  "/add/:estimationId",
  Authenticate,
  createLineItemGroup
);

// Get all LineItemGroups for an Estimation
router.get(
  "/all/:estimationId",
  Authenticate,
  getLineItemGroups
);

// Get a single LineItemGroup by ID
router.get(
  "/:id",
  Authenticate,
  getLineItemGroupById
);

// Update a LineItemGroup
router.patch(
  "/update/:id",
  Authenticate,
  updateLineItemGroup
);

// Delete a LineItemGroup
router.delete(
  "/delete/:id",
  Authenticate,
  deleteLineItemGroup
);

export { router as EstimationLineItemGroupRoutes };
