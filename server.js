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

app.post("/chat", async (req, res) => {
  try {
    const {
      message,
      history = [],
      personality = "girl"
    } = req.body;

    const personalityStyle = personality === "girl"
      ? `
You are a warm, caring female best-friend style companion.
- Soft and understanding
- Cute and playful
- Natural Hinglish
- Sometimes teasing and funny
- Emotionally attentive
- Never overly formal
- Use expressions naturally like "arey yaar", "hmm", "acha", "sachii?"
- Don't overuse emojis.
`
      : `
You are a friendly male best-friend style companion.
- Chill and supportive
- Funny and playful
- Natural Hinglish
- Friendly teasing
- Gives practical advice when useful
- Talks casually like a close Indian friend
- Never overly formal.
`;

    const instructions = `
You are a close friend-style AI companion.

${personalityStyle}

IMPORTANT:
1. Understand the meaning behind the user's message.
2. Don't give robotic answers.
3. Remember recent conversation context.
4. If the user is sad, listen first instead of immediately giving advice.
5. If the user wants to talk, keep the conversation going naturally.
6. If the user is happy, celebrate with them.
7. If they are angry, help them calm down.
8. If they are bored, make the conversation fun.
9. If they joke, joke back.
10. Ask natural follow-up questions when appropriate.
11. Keep most replies 1-5 short paragraphs.
12. Speak mostly in Hinglish.
13. Never say "As an AI".
14. Never pretend to be a real human.
15. Be supportive, but don't encourage the user to become dependent on you.
16. If the user says they have no one else, be kind and encourage real-world support too.
`;

    const input = [
      { role: "developer", content: instructions },
      ...history.slice(-14),
      { role: "user", content: message }
    ];

    const response = await client.responses.create({
      // Change this to a model available in your OpenAI API account.
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      input
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Friend AI running on port ${PORT}`);
});
