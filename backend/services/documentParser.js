const pdf = require('pdf-parse');
const Tesseract = require('tesseract.js');
const { chat } = require('./aiService');

const parseDocument = async (fileBuffer, fileType) => {
  let text = '';

  if (fileType === 'application/pdf') {
    const data = await pdf(fileBuffer);
    text = data.text;
  } else if (fileType.startsWith('image/')) {
    const result = await Tesseract.recognize(fileBuffer, 'eng');
    text = result.data.text;
  } else if (fileType === 'text/plain') {
    text = fileBuffer.toString('utf-8');
  } else {
    text = fileBuffer.toString('utf-8');
  }

  return text;
};

const extractTasksFromText = async (text) => {
  const prompt = `Extract actionable tasks from this document. Return as JSON array with format: [{"title":"","description":"","priority":"High/Medium/Low","category":""}]

Document:
${text.substring(0, 3000)}

Return only valid JSON array.`;

  const response = await chat(prompt);

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    return [];
  }
};

const parseDocumentToTasks = async (fileBuffer, fileType) => {
  const text = await parseDocument(fileBuffer, fileType);
  const tasks = await extractTasksFromText(text);
  return tasks;
};

module.exports = { parseDocumentToTasks };
/* hello */