import { Router } from "express";
import usersRouter from "./users";
import projectRouter from "./project";

const rootRouter: Router = Router();

rootRouter.use("/users", usersRouter);
rootRouter.use("/project", projectRouter);

export default rootRouter;
