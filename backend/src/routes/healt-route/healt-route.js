import { Router } from "express";
import { healtCheck } from "../../controllers/healt-controller/healt-controller.js";

const router = Router();

router.get("/healt", healtCheck);

export default router;