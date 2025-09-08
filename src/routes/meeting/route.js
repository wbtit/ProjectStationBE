import Authenticate from "../../middlewares/authenticate.js";
import express from "express";

import {
  createMeeting,
  getMeetingForUser,
  getMeetingById,
  updateMeeting,
  cancelMeeting,
  //-----------
  RSVP,
  markAttendence,
  getAttendee,
//--------------
  addParticipants,
  updateParticipant,
  removeParticipant,
//--------------
  updateMeetingStatus,
  getUpcomigMeetingByuserId,
  getPastMeetingByUserId,
//---------------
  meetingSummary,
  attendanceHistory,
} from "../../controllers/meeting/index.js";

const router = express.Router();

// ─────────────────────────────
// MEETING CRUD
// ─────────────────────────────
router.post("/", Authenticate, createMeeting);
router.get("/", Authenticate, getMeetingForUser);
router.get("/:id", Authenticate, getMeetingById);
router.put("/:id", Authenticate, updateMeeting);
router.delete("/:id", Authenticate, cancelMeeting);

// ─────────────────────────────
// RSVP & ATTENDANCE
// ─────────────────────────────
router.post("/:id/rsvp", Authenticate, RSVP);
router.post("/:id/attendance", Authenticate, markAttendence);
router.get("/:id/attendees", Authenticate, getAttendee);

// ─────────────────────────────
// PARTICIPANTS MANAGEMENT
// ─────────────────────────────
router.post("/:id/participants", Authenticate, addParticipants);
router.put("/participants/:attendeeId", Authenticate, updateParticipant);
router.delete("/participants/:attendeeId", Authenticate, removeParticipant);

// ─────────────────────────────
// STATUS & TIMELINE
// ─────────────────────────────
router.patch("/:meetingId/status", Authenticate, updateMeetingStatus);
router.get("/user/upcoming", Authenticate, getUpcomigMeetingByuserId);
router.get("/user/past", Authenticate, getPastMeetingByUserId);

// ─────────────────────────────
// ANALYTICS & REPORTS
// ─────────────────────────────
router.get("/:id/summary", Authenticate, meetingSummary);
router.get("/user/:userId/attendance", Authenticate, attendanceHistory);
router.get("/stats/overview", Authenticate, meetingStats);

export { router as Meeting };