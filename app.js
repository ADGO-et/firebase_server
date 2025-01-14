const config = require("config");
const express = require("express");
const Groq = require("groq-sdk");

const app = express();
app.use(express.json());

const prompt = `Extract the multiple-choice questions from the following text.
For each question, return a JSON object with the structure:

Ensure that:
1. Each question is followed by its corresponding multiple-choice options.
2. The correct answer is always placed as the 0th index of the 'options' array.
3. Each option is clearly listed in a consistent format, without including letter choices (e.g., A, B, C, D) or ordinal numbers.
4. If the number of options is fewer than or greater than four, still include all available options accordingly.

The output must be represented as a JSON array with the key 'exercises', e.g.:

{
  "exercises": [
    {
      "question": "Sample question text?",
      "options": ["Correct answer", "Option 2", "Option 3", "Option 4"]
    }
  ]
}

Return: list[Exercise]
`;

const GROQ_API_KEY = config.get("groqApiKey");

const groq = new Groq({ apiKey: GROQ_API_KEY });

async function generateWithGroq(part) {
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

async function getGroqChatCompletion(prompt, model, response_format) {
  return await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `{{json}}${prompt}`,
      },
    ],
    response_format: response_format,
    model: model,
  });
}

async function process(pdfText) {
  const groqResults = [];
  let limiter = 0;

  while (limiter < pdfText.length) {
    const part = pdfText.slice(limiter, limiter + 5000);
    limiter += 5000;

    try {
      const groqResult = await generateWithGroq(part);
      groqResults.push(...groqResult.exercises);
    } catch (error) {
      console.log("Error on GROQ");
    }
  }

  return groqResults;
}

app.post("/", async (req, res) => {
  const body = req.body;
  try {
    const result = await process(body.text);
    res.json(result);
  } catch (error) {
    res.status(500).send("An error occurred while processing the text.");
  }
});

module.exports = app;
