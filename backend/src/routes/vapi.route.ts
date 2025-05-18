import { generateInterview, getStatus } from "../controllers/vapi.controller";
import { Router } from "express";

const router = Router();

router.route("/generate").get(generateInterview);
router.route("/status").get(getStatus);

export default router;
