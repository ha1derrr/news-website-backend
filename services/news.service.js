// server/services/news.service.js

import axios from "axios";
import "dotenv/config";
import { ApiError } from "../utils/ApiError.js";

const API_BASE_URL = process.env.NEWS_API_URL;
const API_KEY = process.env.NEWS_API_KEY;

const validateApiKey = () => {
  if (!API_KEY) {
    throw new ApiError(500, "News API key not configured.");
  }
};

export const fetchEverythingNews = async (queryParams) => {
  validateApiKey();
  try {
    const response = await axios.get(`${API_BASE_URL}/everything`, {
      params: { ...queryParams, apiKey: API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching everything news:",
      error.response?.data || error.message
    );
    throw new ApiError(
      error.response?.status || 500,
      error.response?.data?.message || "Failed to fetch everything news."
    );
  }
};

export const fetchTopHeadlines = async (queryParams) => {
  validateApiKey();
  try {
    const response = await axios.get(`${API_BASE_URL}/top-headlines`, {
      params: { ...queryParams, apiKey: API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching top headlines:",
      error.response?.data || error.message
    );
    throw new ApiError(
      error.response?.status || 500,
      error.response?.data?.message || "Failed to fetch top headlines."
    );
  }
};

export const fetchNewsSources = async (queryParams) => {
  validateApiKey();
  try {
    const response = await axios.get(`${API_BASE_URL}/top-headlines/sources`, {
      params: { ...queryParams, apiKey: API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching news sources:",
      error.response?.data || error.message
    );
    throw new ApiError(
      error.response?.status || 500,
      error.response?.data?.message || "Failed to fetch news sources."
    );
  }
};
