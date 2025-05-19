import { generateInterview, getStatus } from "../controllers/vapi.controller";
import { Router } from "express";

const router = Router();

router.route("/generate")
  .post(generateInterview)  
  .get(getStatus);          

export default router;
