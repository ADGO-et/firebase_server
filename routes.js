const express = require("express");
const {
  exercise_extract_prompt,
  exercise_generate_prompt,
} = require("./utils/prompts");
const { process } = require("./process");

const router = express.Router();

router.post("/extract", async (req, res) => {
  const body = req.body;
  try {
    const result = await process(exercise_extract_prompt, body.text);
    res.json(result);
  } catch (error) {
    res.status(500).send("An error occurred while processing the text.");
  }
});

router.post("/generate/:count", async (req, res) => {
  const body = req.body;
  const limit = parseInt(req.params.count, 10);
  try {
    const result = await process(exercise_generate_prompt, body.text, limit);
    res.json(result);
  } catch (error) {
    res.status(500).send("An error occurred while processing the text.");
  }
});

module.exports = router;
