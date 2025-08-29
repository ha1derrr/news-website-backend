import {
  fetchEverythingNews,
  fetchTopHeadlines,
  fetchNewsSources,
} from "../services/news.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";

export const getEverything = catchAsync(async (req, res) => {
  const newsData = await fetchEverythingNews(req.query);
  res
    .status(200)
    .json(
      new ApiResponse(200, newsData, "Everything news fetched successfully.")
    );
});

export const getTopHeadlines = catchAsync(async (req, res) => {
  const newsData = await fetchTopHeadlines(req.query);
  res
    .status(200)
    .json(
      new ApiResponse(200, newsData, "Top headlines fetched successfully.")
    );
});

export const getSources = catchAsync(async (req, res) => {
  const newsData = await fetchNewsSources(req.query);
  res
    .status(200)
    .json(new ApiResponse(200, newsData, "News sources fetched successfully."));
});
