import axiosInstance from "./axiosInstance";
import type { AdminStats } from "@/types/admin";

export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await axiosInstance.get("/admin/stats");
  return response.data;
};