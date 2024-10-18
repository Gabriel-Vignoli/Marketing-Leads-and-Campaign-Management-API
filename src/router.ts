import { Router } from "express";
import { HttpError } from "./errors/HttpError";

const router = Router();

router.get("/status", (req, res, next) => {
  try {
    throw new HttpError(401, "Unauthorized access");
    res.json({ message: "OK" });
  } catch (error) {
    next(error)
  }
});

export { router };
