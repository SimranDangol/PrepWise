import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import vapiRouter from "./routes/vapi.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: ["http://localhost:3000", "https://prepwise-mu.vercel.app"],
    credentials: true,
  })
);

app.use(cookieParser());

//routes
app.get("/", (req, res) => {
  res.send("PrepWise backend is live!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vapi", vapiRouter);

export default app;
