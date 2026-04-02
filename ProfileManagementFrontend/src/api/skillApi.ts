import axiosInstance from "./axiosInstance";
import type { SkillResponse, CreateSkillRequest, UpdateSkillRequest } from "../types/skill";

export const getSkills = async (): Promise<SkillResponse[]> => {
    const response = await axiosInstance.get<SkillResponse[]>('/skill');
    return response.data;
}

export const getSkillById = async (id: number): Promise<SkillResponse> => {
    const response = await axiosInstance.get<SkillResponse>(`/skill/${id}`);
    return response.data;
}

export const createSkill = async (data: CreateSkillRequest): Promise<SkillResponse> => {
    const response = await axiosInstance.post<SkillResponse>('/skill', data);
    return response.data;
}

export const updateSkill = async (id: number, data: UpdateSkillRequest): Promise<SkillResponse> => {
    const response = await axiosInstance.put<SkillResponse>(`/skill/${id}`, data);
    return response.data;
}

export const deleteSkill = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/skill/${id}`);
}

export const getPublicSkills = async (userId: string) => {
  const response = await axiosInstance.get(`/skill/public/${userId}`);
  return response.data;
};