import { Router } from "express";
import usersRouter from "./users";
import journalRouter from "./journal";

const rootRouter: Router = Router();

rootRouter.use("/users", usersRouter);
rootRouter.use("/journal", journalRouter);

export default rootRouter;
