const { generateWithGroq } = require("./utils/groq");

async function process(prompt, pdfText, count = 100) {
  const groqResults = [];
  let limiter = 0;

  while (limiter < pdfText.length && groqResults.length < count) {
    const part = pdfText.slice(limiter, limiter + 5000);
    limiter += 5000;

    try {
      const groqResult = await generateWithGroq(prompt, part);
      groqResults.push(...groqResult.exercises);
    } catch (error) {
      console.log("Error on GROQ");
    }
  }

  return groqResults.slice(0, count);
}

module.exports = { process };
