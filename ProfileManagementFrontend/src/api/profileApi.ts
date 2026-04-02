import axiosInstance from "./axiosInstance";
import type { ProfileResponse, UpdateProfileRequest } from "@/types/profile";

export const getMyProfile = async (): Promise<ProfileResponse> => {
  const response = await axiosInstance.get("/profile/me");
  return response.data;
};

export const updateMyProfile = async (data: UpdateProfileRequest): Promise<ProfileResponse> => {
  const response = await axiosInstance.put("/profile/me", data);
  return response.data;
};

export const getAllProfiles = async (): Promise<ProfileResponse[]> => {
  const response = await axiosInstance.get("/profile");
  return response.data;
};

export const getPublicProfile = async (userId: string): Promise<ProfileResponse> => {
  const response = await axiosInstance.get(`/profile/${userId}`);
  return response.data;
};