import { Router } from "express";
import { errorHandler } from "../middlewares/errorMiddleware";
import { authorize } from "../middlewares/permissionMiddleware";
import {
    getJournalEntries,
    getJournalEntryById,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    searchJournalEntries,
} from "../controllers/journal";

const journalRouter: Router = Router();

journalRouter.get("/", authorize("read"), errorHandler(getJournalEntries));
journalRouter.post("/search", authorize("read"), errorHandler(searchJournalEntries));
journalRouter.get("/:journalEntryId", authorize("read"), errorHandler(getJournalEntryById));
journalRouter.post("/", authorize("create"), errorHandler(createJournalEntry));
journalRouter.put(
    "/:journalEntryId",
    authorize("update"),
    errorHandler(updateJournalEntry)
);
journalRouter.delete(
    "/:journalEntryId",
    authorize("delete"),
    errorHandler(deleteJournalEntry)
);

export default journalRouter;
