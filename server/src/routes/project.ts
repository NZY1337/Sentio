import { Router } from "express";
import { errorHandler } from "../middlewares/errorMiddleware";
import { 
    getProjects, 
    getProjectById,
    createProject,
    updateProject,
    deleteProject 
} from "../controllers/project";

const projectRouter: Router = Router();

projectRouter.get("/", errorHandler(getProjects));
projectRouter.get("/:projectId", errorHandler(getProjectById));
projectRouter.post("/", errorHandler(createProject));
projectRouter.put("/:projectId", errorHandler(updateProject));
projectRouter.delete("/:projectId", errorHandler(deleteProject));

export default projectRouter;
