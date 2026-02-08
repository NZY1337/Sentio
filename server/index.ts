import express, { Express } from "express";
import { createServer, get } from "http";
import { PORT } from "./secrets";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./src/middlewares/errorMiddleware";
import { clerkWebhook } from "./src/webhooks/clerk";
import { clerkMiddleware, getAuth } from "@clerk/express";
import rootRouter from "./src/routes";

const app: Express = express();
const server = createServer(app);

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

app.get("/", (req, res) => {
    const auth = getAuth(req);
    console.log(auth.userId, "from root");

    if (!auth.userId) {
        // User is not authenticated
        // throw new BadRequestException(400, "Bad Request");}
        // return res.redirect('/login');
        return res.status(400).json({ error: "Bad Request" });
    }

    res.send("Hello World!");
});

app.post("/webhook", express.raw({ type: "application/json" }), clerkWebhook);
app.use("/api", rootRouter);
app.use(errorMiddleware);

server.listen(PORT, () => console.log("App is working on port: " + PORT));
