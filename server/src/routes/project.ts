import { Router } from "express";
import { errorHandler } from "../middlewares/errorMiddleware";
import { authorize, requireProjectOwner } from "../middlewares/permissionMiddleware";
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} from "../controllers/project";

const projectRouter: Router = Router();

projectRouter.get("/", authorize("read"), errorHandler(getProjects));
projectRouter.get("/:projectId", authorize("read"), errorHandler(getProjectById));
projectRouter.post("/", authorize("create"), errorHandler(createProject));
projectRouter.put(
    "/:projectId",
    authorize("update"),
    requireProjectOwner,
    errorHandler(updateProject)
);
projectRouter.delete(
    "/:projectId",
    authorize("delete"),
    requireProjectOwner,
    errorHandler(deleteProject)
);

export default projectRouter;
