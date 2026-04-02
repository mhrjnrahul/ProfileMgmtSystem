import axiosInstance from './axiosInstance'
import type { EducationResponse, CreateEducationRequest, UpdateEducationRequest } from '../types/education'

export const getEducations = async (): Promise<EducationResponse[]> => {
  const response = await axiosInstance.get<EducationResponse[]>('/education')
  return response.data
}

export const getEducationById = async (id: number): Promise<EducationResponse> => {
  const response = await axiosInstance.get<EducationResponse>(`/education/${id}`)
  return response.data
}

export const createEducation = async (data: CreateEducationRequest): Promise<EducationResponse> => {
  const response = await axiosInstance.post<EducationResponse>('/education', data)
  return response.data
}

export const updateEducation = async (id: number, data: UpdateEducationRequest): Promise<EducationResponse> => {
  const response = await axiosInstance.put<EducationResponse>(`/education/${id}`, data)
  return response.data
}

export const deleteEducation = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/education/${id}`)
}

export const getPublicEducations = async (userId: string) => {
  const response = await axiosInstance.get(`/education/public/${userId}`);
  return response.data;
};