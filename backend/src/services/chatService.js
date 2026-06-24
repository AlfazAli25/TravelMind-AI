import Chat from '../models/Chat.js';
import Itinerary from '../models/Itinerary.js';
import * as geminiService from './geminiService.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Send a message to the AI chat assistant with itinerary context
 */
export const sendMessage = async (itineraryId, userId, userMessage) => {
  // Get the itinerary for context
  const itinerary = await Itinerary.findOne({ _id: itineraryId, userId });
  if (!itinerary) {
    throw ApiError.notFound('Itinerary not found');
  }

  // Get or create chat
  let chat = await Chat.findOne({ userId, itineraryId });
  if (!chat) {
    chat = await Chat.create({ userId, itineraryId, messages: [] });
  }

  // Add user message
  chat.messages.push({ role: 'user', content: userMessage });

  // Get recent history for context (last 10 messages)
  const recentHistory = chat.messages.slice(-10);

  // Call Gemini with itinerary context
  const aiResponse = await geminiService.chat(
    itinerary.itinerary,
    recentHistory,
    userMessage
  );

  // Add AI response
  chat.messages.push({ role: 'assistant', content: aiResponse });
  await chat.save();

  return {
    message: aiResponse,
    history: chat.messages,
  };
};

/**
 * Get chat history for an itinerary
 */
export const getChatHistory = async (itineraryId, userId) => {
  const chat = await Chat.findOne({ userId, itineraryId });
  return chat ? chat.messages : [];
};
