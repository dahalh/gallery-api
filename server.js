import "dotenv/config";
import express from "express";
const app = express();
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

const PORT = process.env.PORT || 8000;

// use middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// mongodb connect
import { dbConnect } from "./src/config/dbConfig.js";
dbConnect();

// routers

import userRouter from "./src/routers/userRouter.js";

app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.json({
    message: "you have reached the user api",
  });
});

// error handling

app.use((err, req, res, next) => {
  // login in file system or time series db like cloudwatch

  res.status(err.status || 400);
  res.json({
    status: "error",
    message: err.message,
  });
});

// bound app wit the port to serve on internet
app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server is running on http://localhost:${PORT}`);
});
