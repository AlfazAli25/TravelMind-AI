import * as itineraryService from '../services/itineraryService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/helpers.js';

export const getSharedItinerary = asyncHandler(async (req, res) => {
  const itinerary = await itineraryService.getSharedItinerary(
    req.params.shareId
  );
  ApiResponse.success(itinerary, 'Shared itinerary retrieved').send(res);
});
