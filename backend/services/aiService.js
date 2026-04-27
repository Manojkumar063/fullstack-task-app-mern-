const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const axios = require('axios');

const AI_PROVIDER = process.env.AI_PROVIDER || 'ollama';

const bedrockClient = new BedrockRuntimeClient({ 
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const invokeOllama = async (prompt, conversationHistory = []) => {
  const fullPrompt = conversationHistory.length > 0
    ? conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n') + `\nuser: ${prompt}`
    : prompt;

  const response = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
    model: process.env.OLLAMA_MODEL || 'llama3.2',
    prompt: fullPrompt,
    stream: false
  });
  return response.data.response;
};

const invokeBedrock = async (prompt, conversationHistory = []) => {
  const messages = conversationHistory.length > 0
    ? [...conversationHistory, { role: 'user', content: prompt }]
    : [{ role: 'user', content: prompt }];

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1000,
    messages
  };

  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload)
  });

  const response = await bedrockClient.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  return result.content[0].text;
};

const invokeModel = async (prompt, conversationHistory = []) => {
  return AI_PROVIDER === 'bedrock' 
    ? await invokeBedrock(prompt, conversationHistory) 
    : await invokeOllama(prompt, conversationHistory);
};

const chat = async (message, conversationHistory = []) => {
  return await invokeModel(message, conversationHistory);
};

const generateTaskSuggestions = async (context) => {
  const prompt = `Generate 5 task suggestions for: ${context}. Return only task titles, one per line.`;
  return await invokeModel(prompt);
};

const generateTaskDescription = async (title) => {
  const prompt = `Create a brief task description for: "${title}". Keep it under 100 words.`;
  return await invokeModel(prompt);
};

const breakdownTask = async (task) => {
  const prompt = `Break down this task into 3-5 subtasks: "${task}". Return only subtask titles, one per line.`;
  return await invokeModel(prompt);
};

const predictPriority = async (title) => {
  const prompt = `Analyze this task and suggest priority (High/Medium/Low): "${title}". Return only the priority level.`;
  return await invokeModel(prompt);
};

const analyzeTaskContext = async (tasks) => {
  const taskList = tasks.map(t => `- ${t.title} (${t.completed ? 'Done' : 'Pending'})`).join('\n');
  const prompt = `Analyze these tasks and provide insights:\n${taskList}\n\nProvide: 1) Productivity score (0-100), 2) Top priority recommendation, 3) Time management tip.`;
  return await invokeModel(prompt);
};

const generateSmartReminder = async (task) => {
  const prompt = `Create a motivational reminder message for this task: "${task}". Keep it under 50 words.`;
  return await invokeModel(prompt);
};

const categorizeTask = async (title) => {
  const prompt = `Categorize this task into one category (Work/Personal/Health/Finance/Learning/Shopping/Other): "${title}". Return only the category name.`;
  return await invokeModel(prompt);
};

const estimateTaskTime = async (title) => {
  const prompt = `Estimate time needed for this task in minutes: "${title}". Return only a number.`;
  return await invokeModel(prompt);
};

const generateTaskFromVoice = async (voiceText) => {
  const prompt = `Convert this voice input into a structured task. Extract: title, description, priority, category.\nInput: "${voiceText}"\nReturn as JSON: {"title":"","description":"","priority":"","category":""}`;
  return await invokeModel(prompt);
};

const smartSearch = async (query, tasks) => {
  const taskList = tasks.map(t => `${t._id}: ${t.title}`).join('\n');
  const prompt = `Find tasks matching: "${query}"\nTasks:\n${taskList}\n\nReturn matching task IDs as comma-separated list.`;
  return await invokeModel(prompt);
};

module.exports = { 
  generateTaskSuggestions, 
  generateTaskDescription, 
  breakdownTask, 
  predictPriority, 
  chat,
  analyzeTaskContext,
  generateSmartReminder,
  categorizeTask,
  estimateTaskTime,
  generateTaskFromVoice,
  smartSearch
};
