import axiosInstance from "./axiosInstance";
import type { SocialLinkResponse, CreateSocialLinkRequest, UpdateSocialLinkRequest } from "@/types/socialLink";

export const getSocialLinks = async (): Promise<SocialLinkResponse[]> => {
    const response = await axiosInstance.get<SocialLinkResponse[]>('/sociallink');
    return response.data;
}

export const getSocialLinkById = async (id: number): Promise<SocialLinkResponse> => {
    const response = await axiosInstance.get<SocialLinkResponse>(`/sociallink/${id}`);
    return response.data;
}

export const createSocialLink = async (data: CreateSocialLinkRequest): Promise<SocialLinkResponse> => {
    const response = await axiosInstance.post<SocialLinkResponse>('/sociallink', data);
    return response.data;
}

export const updateSocialLink = async (id: number, data: UpdateSocialLinkRequest): Promise<SocialLinkResponse> => {
    const response = await axiosInstance.put<SocialLinkResponse>(`/sociallink/${id}`, data);
    return response.data;
}

export const deleteSocialLink = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/sociallink/${id}`);
}

export const getPublicSocialLinks = async (userId: string) => {
  const response = await axiosInstance.get(`/sociallink/public/${userId}`);
  return response.data;
};