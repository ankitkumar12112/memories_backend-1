import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import * as middlewares from "./middlewares";
import MessageResponse from "./interfaces/MessageResponse";
import post from "./api/post/post.routes";
import auth from "./api/auth/auth.routes";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- CORS setup (robust for Vercel) ---
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

// Dev fallback if env not set
if (ALLOWED_ORIGINS.length === 0) {
  ALLOWED_ORIGINS.push("http://localhost:3000", "https://memories-indol-six.vercel.app");
}

const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    // Allow same-origin tools (no Origin header) and allow-list matches
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // set to true only if you use cookies/auth
};

// Apply CORS to all routes
app.use(cors(corsOptions));
// Ensure preflight is handled for every path
app.options("*", cors(corsOptions));

// Avoid serving cached responses with wrong CORS headers from Vercel’s CDN
app.use((req, res, next) => {
  res.setHeader("Vary", "Origin");
  next();
});

// --- Other middlewares ---
app.use(morgan("dev"));
app.use(helmet());

// --- Health & base routes ---
app.get("/ping", (_req, res) => res.json({ ok: true }));

app.get<{}, MessageResponse>("/", (_req, res) => {
  res.json({ message: "Welcome To Backend" });
});

// --- API routes ---
app.use("/post", post);
app.use("/auth", auth);

// --- Error handlers ---
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
