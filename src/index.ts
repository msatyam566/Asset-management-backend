import express, { Application, Request, Response } from "express";
import http from "http";
import cors from "cors";
import routes from "./routes/index";
import cookieParser from "cookie-parser";
import path from "path";
import * as Express from "express";

declare global {
  namespace Express {
    interface Request {
      files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
    }
  }
}

const app: Application = express();


app.use(cookieParser());

app.use(express.json({ limit: "50mb"}));

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use(
  cors({
    origin: [
      "http://localhost:5173", // port for frontend

    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Asset controller");
});

app.use(routes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


// HTTP Server
const httpPort: number = parseInt(process.env.HTTP_PORT || "5000");
const httpServer: http.Server = http.createServer(app);

httpServer.listen(httpPort, () => {
  console.log(`HTTP server running on port ${httpPort}`);
});
