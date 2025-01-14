const { generateWithGroq } = require("./utils/groq");

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

module.exports = { process };
