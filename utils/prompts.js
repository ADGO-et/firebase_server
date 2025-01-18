const exercise_extract_prompt = `Extract the multiple-choice questions from the following text.
For each question, return a JSON objects.

For each question, ensure that:  
1. The question text is followed by a corresponding array of multiple-choice options.  
2. The correct answer is always the first option (index 0) in the 'options' array.  
3. Options are formatted consistently, without prefixes like letters (e.g., A, B, C, D) or ordinal numbers.  
4. All available options are included, even if fewer or more than four are provided.  

Return the output as a JSON array with the key 'exercises', e.g.:

{
  "exercises": [
    {
      "question": "Sample question text?",
      "options": ["Correct answer", "Option 2", "Option 3", "Option 4"]
    }
  ]
}

Ignore and do not process any text under sections titled: 
- "Learning outcomes" 
- "By the end of this section, you should be able to"
- "By the end of this section you will be able to"
- "After completing this section, you will be able to"

Return: list[Exercise]
`;

const exercise_generate_prompt = `Generate multiple-choice questions from the following text based on its content.
For each question, return a JSON objects.

For each question, ensure that:  
1. The question text is followed by a corresponding array of multiple-choice options.  
2. The correct answer is always the first option (index 0) in the 'options' array.  
3. Options are formatted consistently, without prefixes like letters (e.g., A, B, C, D) or ordinal numbers.  
4. All available options are included, even if fewer or more than four are provided.  

Return the output as a JSON array with the key 'exercises', e.g.:

{
  "exercises": [
    {
      "question": "Sample question text?",
      "options": ["Correct answer", "Option 2", "Option 3", "Option 4"]
    }
  ]
}

Ignore and do not process any text under sections titled: 
- "Learning outcomes" 
- "By the end of this section, you should be able to"
- "By the end of this section you will be able to"
- "After completing this section, you will be able to"

Return: list[Exercise]
`;

module.exports = {
  exercise_extract_prompt,
  exercise_generate_prompt,
};
