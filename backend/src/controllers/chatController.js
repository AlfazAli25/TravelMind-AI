import * as chatService from '../services/chatService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/helpers.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const result = await chatService.sendMessage(
    req.params.itineraryId,
    req.user._id,
    message
  );
  ApiResponse.success(result, 'Message sent').send(res);
});

export const getHistory = asyncHandler(async (req, res) => {
  const history = await chatService.getChatHistory(
    req.params.itineraryId,
    req.user._id
  );
  ApiResponse.success(history, 'Chat history retrieved').send(res);
});
