import axiosInstance from "./axiosInstance";
import type { WorkExperienceResponse, CreateWorkExperienceRequest, UpdateWorkExperienceRequest } from "../types/workexperience";

export const getWorkExperiences = async (): Promise<WorkExperienceResponse[]> => {
    const response = await axiosInstance.get<WorkExperienceResponse[]>('/workexperience');
    return response.data;
}

export const getWorkExperienceById = async (id: number): Promise<WorkExperienceResponse> => {
    const response = await axiosInstance.get<WorkExperienceResponse>(`/workexperience/${id}`);
    return response.data;
}

export const createWorkExperience = async (data: CreateWorkExperienceRequest): Promise<WorkExperienceResponse> => {
  const payload = {
    ...data,
    endDate: data.endDate === '' ? null : data.endDate,
  }
  const response = await axiosInstance.post<WorkExperienceResponse>('/workexperience', payload)
  return response.data
}

export const updateWorkExperience = async (id: number, data: UpdateWorkExperienceRequest): Promise<WorkExperienceResponse> => {
  const payload = {
    ...data,
    endDate: data.endDate === '' ? null : data.endDate,
  }
  const response = await axiosInstance.put<WorkExperienceResponse>(`/workexperience/${id}`, payload)
  return response.data
}

export const deleteWorkExperience = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/workexperience/${id}`);
}

export const getPublicWorkExperiences = async (userId: string) => {
  const response = await axiosInstance.get(`/workexperience/public/${userId}`);
  return response.data;
};