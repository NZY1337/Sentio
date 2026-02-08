import { Router } from "express";
import { errorHandler } from "../middlewares/errorMiddleware";
import { 
    getProjects, 
    getProjectById,
    createProject,
    updateProject,
    deleteProject 
} from "../controllers/project";
import { authMiddleware } from "../middlewares/authMiddleware";

const projectRouter: Router = Router();

projectRouter.get("/", authMiddleware, errorHandler(getProjects));
projectRouter.get("/:projectId", authMiddleware, errorHandler(getProjectById));
projectRouter.post("/", authMiddleware, errorHandler(createProject));
projectRouter.put("/:projectId", authMiddleware, errorHandler(updateProject));
projectRouter.delete("/:projectId", authMiddleware, errorHandler(deleteProject));

export default projectRouter;
