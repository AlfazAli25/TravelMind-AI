import * as uploadService from '../services/uploadService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/helpers.js';

export const uploadFiles = asyncHandler(async (req, res) => {
  const result = await uploadService.processUploads(req.files, req.user._id);
  ApiResponse.created(result, 'Files uploaded and processed').send(res);
});
