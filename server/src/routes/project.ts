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


// Project router removed. Use journal router instead.
export default projectRouter;
