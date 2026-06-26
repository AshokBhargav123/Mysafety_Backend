import express from "express";
import cors from "cors";
import morgan from "morgan";

import routes from "./routes/master.routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/users", routes);

export default app;