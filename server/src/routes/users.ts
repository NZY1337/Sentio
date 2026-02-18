import { Router } from "express";
import { errorHandler } from "../middlewares/errorMiddleware";

import { updateUserRole, getUser, getUsers, deleteUser, updateConsentPolicy } from "../controllers/users";

const usersRouter: Router = Router();

usersRouter.put("/metadata/updateRole", errorHandler(updateUserRole));
usersRouter.get("/", errorHandler(getUsers));
usersRouter.get("/me", errorHandler(getUser));
usersRouter.delete("/", errorHandler(deleteUser));
usersRouter.put("/metadata/updateConsent", errorHandler(updateConsentPolicy))

export default usersRouter;