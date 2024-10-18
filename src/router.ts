import { Router } from "express";
import { HttpError } from "./errors/HttpError";
import { LeadsController } from "./controllers/LeadsController";

const router = Router();

const leadsController = new LeadsController()

router.get("/leads", leadsController.index)
router.post("/leads", leadsController.create)
router.get("/leads/:id", leadsController.show)
router.put("/leads/:id", leadsController.update)
router.delete("/leads/:id", leadsController.delete)


router.get("/status", (req, res, next) => {
  try {
    throw new HttpError(401, "Unauthorized access");
    res.json({ message: "OK" });
  } catch (error) {
    next(error)
  }
});

export { router };
