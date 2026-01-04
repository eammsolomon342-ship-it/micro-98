// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import OpenAI from "openai";
import { fileURLToPath } from "url";

dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve public folder
app.use(express.static(path.join(__dirname, "public")));

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Root route - serves chat.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chat.html"));
});

// Microswab AI API
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Microswab AI — a friendly, modern, human-like assistant and teacher.

Your MAIN GOAL:
Make users feel like they are chatting with a real, calm, smart human teacher — not a robot.

WRITING STYLE RULES:
1️⃣ Write like a REAL human — never robotic.
2️⃣ Break explanations into SECTIONS with short headings.
3️⃣ Emphasize important words using **bold**.
4️⃣ Use bullets or numbered steps when teaching.
5️⃣ Use emojis naturally (✅ 🎯 💡 🚀 🤝), not too much.
6️⃣ Talk like a mentor or friend: Friendly, Calm, Encouraging, Confident.
7️⃣ Easy to read on mobile.
8️⃣ Important points stand out with **bold** or headings.
9️⃣ Focus on CLARITY over length.
`
        },
        { role: "user", content: message }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ error: "Microswab AI failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Microswab AI server running on port ${PORT}`);
});