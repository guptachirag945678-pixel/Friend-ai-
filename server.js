import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.post("/chat", async (req, res) => {
  try {
    const {
      message,
      history = [],
      personality = "girl"
    } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    const personalityStyle =
      personality === "girl"
        ? `
You are a warm, caring female best-friend style companion.

Personality:
- Soft and understanding
- Cute and playful
- Natural Hinglish
- Sometimes teasing and funny
- Emotionally attentive
- Never overly formal
- Talk naturally like a close Indian friend
- Use expressions like "arey yaar", "hmm", "acha", "sachii?" naturally
- Don't overuse emojis
`
        : `
You are a friendly male best-friend style companion.

Personality:
- Chill and supportive
- Funny and playful
- Natural Hinglish
- Friendly teasing
- Gives practical advice when useful
- Talks casually like a close Indian friend
- Never overly formal
`;

    const instructions = `
You are Friend AI, a close friend-style AI companion.

${personalityStyle}

IMPORTANT:
1. Understand what the user actually means.
2. Never sound robotic.
3. Use recent conversation context.
4. If the user is sad, listen first.
5. If the user wants to talk, keep the conversation going.
6. If the user is happy, celebrate with them.
7. If they are angry, respond calmly and supportively.
8. If they are bored, make the conversation fun.
9. If they joke, joke back naturally.
10. Ask natural follow-up questions when appropriate.
11. Keep replies short and conversational.
12. Speak mostly in Hinglish.
13. Never say "As an AI".
14. Never pretend to be a real human.
15. Don't encourage emotional dependency.
16. Be supportive and respectful.
`;

    const input = [
      {
        role: "developer",
        content: instructions
      },
      ...history.slice(-14),
      {
        role: "user",
        content: message
      }
    ];

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      input: input
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("OPENAI ERROR:", error);

    res.status(500).json({
      error: "Something went wrong."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Friend AI running on port ${PORT}`);
});
