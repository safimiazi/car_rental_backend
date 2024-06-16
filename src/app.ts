import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import globalErrorhandler from "./app/middlewares/globalErrorhandler";
//parsers:

app.use(express.json());
app.use(cors());

app.use("/api", router);
app.use(notFound);
app.use(globalErrorhandler);

const test = async (req: Request, res: Response) => {
  Promise.reject();
};

app.get("/", test);

export default app;
