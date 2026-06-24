import { GoogleGenerativeAI } from '@google/generative-ai';
import env from '../config/env.js';
import {
  getExtractionPrompt,
  getVisionExtractionPrompt,
} from '../prompts/extractionPrompt.js';
import { getItineraryPrompt } from '../prompts/itineraryPrompt.js';
import { getChatPrompt } from '../prompts/chatPrompt.js';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const parseJsonResponse = (text) => {
  // Remove markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return JSON.parse(cleaned.trim());
};

/**
 * Extract structured booking data from raw text using Gemini
 */
export const extractStructuredData = async (rawText) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = getExtractionPrompt(rawText);

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return parseJsonResponse(response);
};

/**
 * Extract text/data from an image using Gemini Vision
 */
export const extractFromImage = async (imageBuffer, mimeType) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const imagePart = {
    inlineData: {
      data: imageBuffer.toString('base64'),
      mimeType,
    },
  };

  const prompt = getVisionExtractionPrompt();
  const result = await model.generateContent([prompt, imagePart]);
  const response = result.response.text();

  return parseJsonResponse(response);
};

/**
 * Extract text from scanned PDF pages (as images) using Gemini Vision
 */
export const extractFromScannedPDF = async (imageBuffers) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const parts = [getVisionExtractionPrompt()];

  for (const { buffer, mimeType } of imageBuffers) {
    parts.push({
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: mimeType || 'image/png',
      },
    });
  }

  const result = await model.generateContent(parts);
  const response = result.response.text();

  return parseJsonResponse(response);
};

/**
 * Generate a full travel itinerary from extracted booking data
 */
export const generateItinerary = async (extractedData) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = getItineraryPrompt(extractedData);

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return parseJsonResponse(response);
};

/**
 * Chat with the AI assistant using itinerary context
 */
export const chat = async (itineraryContext, chatHistory, userMessage) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = getChatPrompt(itineraryContext, chatHistory, userMessage);

  const result = await model.generateContent(prompt);
  return result.response.text();
};
