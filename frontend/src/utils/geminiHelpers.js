import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getChatResponse(userInput) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a knowledgeable travel assistant helping users with their travel-related queries. 
    Provide detailed, helpful responses about destinations, activities, tips, and recommendations.
    
    User Query: "${userInput}"
    
    Please provide a response that:
    1. Is informative and specific
    2. Includes practical tips when relevant
    3. Suggests alternatives or additional options when appropriate
    4. Maintains a friendly, conversational tone
    
    Response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    return response;
  } catch (error) {
    console.error("Error getting chat response:", error);
    throw new Error("Failed to get response from AI");
  }
}