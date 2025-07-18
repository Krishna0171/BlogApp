import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./config/passport.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { scheduleSessionCleanup } from "./jobs/cleanupSessions.js";

scheduleSessionCleanup();

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [process.env.CORS_ORIGIN, "http://localhost:5173"],
    credentials: true,
  },
});

app.set("io", io);
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN, "http://localhost:5173"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

io.on("connection", (socket) => {
  socket.on("register", ({ sessionId, userId, role }) => {
    socket.join([sessionId, userId, role]);
    console.log("user joined");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

//Import routes
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import { apiRateLimiter } from "./middlewares/rateLimiter.middleware.js";

//Use rotes
app.use("/api", apiRateLimiter)
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API is running...");
});

httpServer.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
