import * as itineraryService from '../services/itineraryService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/helpers.js';

export const generate = asyncHandler(async (req, res) => {
  const { extractedData, uploadIds } = req.body;
  const itinerary = await itineraryService.generateItinerary(
    extractedData,
    uploadIds || [],
    req.user._id
  );
  ApiResponse.created(itinerary, 'Itinerary generated successfully').send(res);
});

export const getAll = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const itineraries = await itineraryService.getUserItineraries(
    req.user._id,
    search
  );
  ApiResponse.success(itineraries, 'Itineraries retrieved').send(res);
});

export const getById = asyncHandler(async (req, res) => {
  const itinerary = await itineraryService.getItineraryById(
    req.params.id,
    req.user._id
  );
  ApiResponse.success(itinerary, 'Itinerary retrieved').send(res);
});

export const remove = asyncHandler(async (req, res) => {
  await itineraryService.deleteItinerary(req.params.id, req.user._id);
  ApiResponse.success(null, 'Itinerary deleted').send(res);
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await itineraryService.getDashboardStats(req.user._id);
  ApiResponse.success(stats, 'Dashboard stats retrieved').send(res);
});
