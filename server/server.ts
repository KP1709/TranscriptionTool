// This is a local server to generate a JWT token after providing the API key
// This would be hosted on the backend e.g. Fly.io or Render
// This would also be in a separate repo or selected from a monorepo

import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import { createSpeechmaticsJWT } from "@speechmatics/auth";

const app = express();

app.use(cors({ origin: ["http://localhost:5173",], }));

app.get("/api/speechmatics-token", async (_req, res) => {
  try {
    const apiKey = process.env.SPEECHMATICS_API_KEY;

    if (!apiKey) {
      throw new Error("Missing SPEECHMATICS_API_KEY");
    }

    const jwt = await createSpeechmaticsJWT({
      type: "rt",
      apiKey,
      ttl: 600, // 10 minutes
    });

    res.json({ jwt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create Speechmatics JWT" });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});