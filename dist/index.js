"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
// import routes from "./routes/index";
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
app.use("/uploads", express_1.default.static("uploads"));
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000", // port for accounts
    ],
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.get("/", (req, res) => {
    res.send("User controller");
});
// app.use(routes);
// HTTP Server
const httpPort = parseInt(process.env.HTTP_PORT || "5000");
const httpServer = http_1.default.createServer(app);
httpServer.listen(httpPort, () => {
    console.log(`HTTP server running on port ${httpPort}`);
});
