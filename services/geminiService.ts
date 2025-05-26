
import { GoogleGenAI, Chat, GenerateContentResponse, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { GEMINI_MODEL_NAME, SYSTEM_INSTRUCTION } from '../constants';
import { GuruChat } from "../types";

let ai: GoogleGenAI | null = null;

const getGenAI = (): GoogleGenAI => {
  if (!ai) {
    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable is not set.");
      throw new Error("API_KEY environment variable is not set. Please set it in your environment.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const generationConfig = {
  temperature: 0.7,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

export const createGuruChatSession = async (): Promise<GuruChat> => {
  const genAIInstance = getGenAI();
  try {
    const chat: Chat = genAIInstance.chats.create({
      model: GEMINI_MODEL_NAME,
      config: { // Config for generation parameters
        systemInstruction: SYSTEM_INSTRUCTION,
        ...generationConfig,
      },
      safetySettings: safetySettings, // Safety settings at the top level of options
    });
    return chat as GuruChat;
  } catch (error) {
    console.error("Error creating chat session:", error);
    throw new Error("Could not create chat session with Guru. Please check your API key and network connection.");
  }
};

export const sendMessageToGuru = async (chatSession: GuruChat, messageText: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ message: messageText });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Guru:", error);
    // Check for specific error types if available, e.g. blocked content
    if ((error as any)?.response?.promptFeedback?.blockReason) {
        return "I'm sorry, I can't respond to that due to safety guidelines. Let's focus on your academic questions.";
    }
    return "Oops! Something went wrong while trying to reach Guru. Please try again.";
  }
};
