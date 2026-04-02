export interface WorkExperienceResponse {
    id: number;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
    isCurrent: boolean;
}

export interface CreateWorkExperienceRequest {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
    isCurrent: boolean;
}

export interface UpdateWorkExperienceRequest {
    id: number;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
    isCurrent: boolean;
}