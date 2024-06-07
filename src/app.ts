import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import * as middlewares from "./middlewares";
import MessageResponse from "./interfaces/MessageResponse";
import post from "./api/post/post.routes";
import auth from "./api/auth/auth.routes";
import bodyParser from "body-parser";
import dotenv from "dotenv";





dotenv.config();
const app = express();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "Welcome To Backend",
  });
});
app.use("/post", post);
app.use("/auth", auth);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
