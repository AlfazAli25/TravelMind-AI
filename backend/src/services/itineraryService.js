import { nanoid } from 'nanoid';
import Itinerary from '../models/Itinerary.js';
import * as geminiService from './geminiService.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Generate an itinerary from extracted data using Gemini
 */
export const generateItinerary = async (extractedData, uploadIds, userId) => {
  const shareId = nanoid(12);

  // Create the itinerary record in 'generating' state
  const itinerary = await Itinerary.create({
    userId,
    destination: extractedData.destination || 'Unknown',
    startDate: extractedData.startDate || null,
    endDate: extractedData.endDate || null,
    extractedData,
    itinerary: {},
    uploadIds,
    shareId,
    status: 'generating',
  });

  try {
    // Call Gemini to generate the full itinerary
    const generatedItinerary =
      await geminiService.generateItinerary(extractedData);

    itinerary.itinerary = generatedItinerary;
    itinerary.destination =
      generatedItinerary.destination || extractedData.destination || 'Unknown';
    itinerary.status = 'completed';
    await itinerary.save();

    return itinerary;
  } catch (error) {
    itinerary.status = 'failed';
    await itinerary.save();
    throw ApiError.internal(`Itinerary generation failed: ${error.message}`);
  }
};

/**
 * Get all itineraries for a user with optional search
 */
export const getUserItineraries = async (userId, search = '') => {
  const query = { userId };

  if (search) {
    query.destination = { $regex: search, $options: 'i' };
  }

  return Itinerary.find(query)
    .sort({ createdAt: -1 })
    .select('-itinerary -extractedData')
    .lean();
};

/**
 * Get a single itinerary by ID (with ownership check)
 */
export const getItineraryById = async (id, userId) => {
  const itinerary = await Itinerary.findOne({ _id: id, userId });
  if (!itinerary) {
    throw ApiError.notFound('Itinerary not found');
  }
  return itinerary;
};

/**
 * Delete an itinerary
 */
export const deleteItinerary = async (id, userId) => {
  const itinerary = await Itinerary.findOneAndDelete({ _id: id, userId });
  if (!itinerary) {
    throw ApiError.notFound('Itinerary not found');
  }
  return itinerary;
};

/**
 * Get a shared itinerary by shareId (no auth required)
 */
export const getSharedItinerary = async (shareId) => {
  const itinerary = await Itinerary.findOne({ shareId, status: 'completed' });
  if (!itinerary) {
    throw ApiError.notFound('Shared itinerary not found');
  }
  return itinerary;
};

/**
 * Get dashboard stats for a user
 */
export const getDashboardStats = async (userId) => {
  const itineraries = await Itinerary.find({ userId }).lean();

  const now = new Date();
  const total = itineraries.length;
  const upcoming = itineraries.filter(
    (i) => i.startDate && new Date(i.startDate) > now
  ).length;
  const completed = itineraries.filter(
    (i) => i.endDate && new Date(i.endDate) < now
  ).length;
  const shared = itineraries.filter((i) => i.shareId).length;

  return { total, upcoming, completed, shared };
};
