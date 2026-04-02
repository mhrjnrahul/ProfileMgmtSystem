import axiosInstance from "./axiosInstance";
import type { ProjectResponse, CreateProjectRequest, UpdateProjectRequest } from "../types/project";

export const getProjects = async (): Promise<ProjectResponse[]> => {
    const response = await axiosInstance.get<ProjectResponse[]>('/project');
    return response.data;
}

export const getProjectById = async (id: number): Promise<ProjectResponse> => {
    const response = await axiosInstance.get<ProjectResponse>(`/project/${id}`);
    return response.data;
}

export const createProject = async (data: CreateProjectRequest): Promise<ProjectResponse> => {
    const payload = {
        ...data,
        endDate: data.endDate === '' ? null : data.endDate,
    }
    const response = await axiosInstance.post<ProjectResponse>('/project', payload);
    return response.data;
}

export const updateProject = async (id: number, data: UpdateProjectRequest): Promise<ProjectResponse> => {
    const payload = {
        ...data,
        endDate: data.endDate === '' ? null : data.endDate,
    }
    const response = await axiosInstance.put<ProjectResponse>(`/project/${id}`, payload);
    return response.data;
}

export const deleteProject = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/project/${id}`);
}

export const getPublicProjects = async (userId: string) => {
  const response = await axiosInstance.get(`/project/public/${userId}`);
  return response.data;
};