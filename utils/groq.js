const config = require("config");
const Groq = require("groq-sdk");

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

module.exports = { generateWithGroq };
