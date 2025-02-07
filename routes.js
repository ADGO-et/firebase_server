const express = require("express");
const {
  sendNotificationToGroup,
  sendNotificationToIndividual,
} = require("./utils/firebase");

const router = express.Router();

router.post("/notification/batch", async (req, res) => {
  const { tokens, type, details } = req.body;
  try {
    const result = await sendNotificationToGroup(tokens, type, details);
    res.json(result);
  } catch (error) {
    res.status(500).send("An error occurred during the process.");
  }
});

router.post("/notification/single", async (req, res) => {
  const { token, type, details } = req.body;

  console.log(token, type, details);

  try {
    const result = await sendNotificationToIndividual(token, type, details);
    res.json(result);
  } catch (error) {
    res.status(500).send("An error occurred during the process.");
  }
});

module.exports = router;
