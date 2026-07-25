import express from "express";
import {
  login,
  register,
  refresh,
  logout,
} from "../controllers/loginController.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", register);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
