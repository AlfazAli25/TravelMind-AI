import * as authService from '../services/authService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/helpers.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.registerUser({ name, email, password });
  ApiResponse.created(result, 'Registration successful').send(res);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  ApiResponse.success(result, 'Login successful').send(res);
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user._id);
  ApiResponse.success(user, 'Profile retrieved').send(res);
});
