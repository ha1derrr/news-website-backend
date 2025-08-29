import express from "express";
import {
  getEverything,
  getTopHeadlines,
  getSources,
} from "../controllers/news.controller.js";

const router = express.Router();

router.get("/everything", getEverything);
router.get("/top-headlines", getTopHeadlines);
router.get("/sources", getSources);

export default router;
