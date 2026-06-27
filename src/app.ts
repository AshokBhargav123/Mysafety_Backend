import express from "express";
import cors from "cors";
import morgan from "morgan";

import routes from "./routes/master.routes";
import path from "path";

const app = express();


app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.use("/api/users", routes);

export default app;