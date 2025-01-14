const config = require("config");
const express = require("express");
const Groq = require("groq-sdk");
const {
  exercise_extract_prompt,
  exercise_generate_prompt,
} = require("./prompts");

const app = express();
app.use(express.json());

const GROQ_API_KEY = config.get("groqApiKey");
const groq = new Groq({ apiKey: GROQ_API_KEY });

async function generateWithGroq(prompt, part) {
  try {
    const chatCompletion = await getGroqChatCompletion(
      prompt + part,
      "llama3-70b-8192",
      { type: "json_object" }
    );

    const result = chatCompletion.choices?.[0]?.message?.content;

    if (!result) {
      throw new Error("Empty response from GROQ");
    }

    const parsedResult = JSON.parse(result);
    if (!parsedResult.exercises) {
      throw new Error("Missing 'exercises' key in response");
    }

    return parsedResult;
  } catch (error) {
    console.error("Error in generateWithGroq:", error.message);
    return { exercises: [] };
  }
}

async function getGroqChatCompletion(
  exercise_extract_prompt,
  model,
  response_format
) {
  return await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `{{json}}${exercise_extract_prompt}`,
      },
    ],
    response_format: response_format,
    model: model,
  });
}

async function process(prompt, pdfText) {
  const groqResults = [];
  let limiter = 0;

  while (limiter < pdfText.length) {
    const part = pdfText.slice(limiter, limiter + 5000);
    limiter += 5000;

    try {
      const groqResult = await generateWithGroq(prompt, part);
      groqResults.push(...groqResult.exercises);
    } catch (error) {
      console.log("Error on GROQ");
    }
  }

  return groqResults;
}

app.post("/extract", async (req, res) => {
  const body = req.body;
  try {
    const result = await process(exercise_extract_prompt, body.text);
    res.json(result);
  } catch (error) {
    res.status(500).send("An error occurred while processing the text.");
  }
});

app.post("/generate", async (req, res) => {
  const body = req.body;
  try {
    const result = await process(exercise_generate_prompt, body.text);
    res.json(result);
  } catch (error) {
    res.status(500).send("An error occurred while processing the text.");
  }
});

module.exports = app;
