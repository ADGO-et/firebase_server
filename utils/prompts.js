const exercise_extract_prompt = `Extract the multiple-choice questions from the following text.
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

const exercise_generate_prompt = `Generate multiple-choice questions from the following text based on its content.
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

module.exports = {
  exercise_extract_prompt,
  exercise_generate_prompt,
};
