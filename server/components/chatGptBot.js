import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (userMessage) => {
  try {
    if (!userMessage) {
      throw new Error("Message is required");
    }

    // Use the latest model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 200 },
    });

    const result = await chat.sendMessage(userMessage);

    return result.response.text(); // Extract text from the response
  } catch (error) {
    console.error("🚨 Gemini API Error:", error);
    return "Chatbot service unavailable!";
  }
};
