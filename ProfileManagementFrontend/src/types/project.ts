export interface ProjectResponse {
    id: number,
    title: string,
    description?: string,
    url?: string,
    startDate: string,
    endDate?: string
}

export interface CreateProjectRequest {
    title: string,
    description?: string,
    url?: string,
    startDate: string,
    endDate?: string
}

export interface UpdateProjectRequest {
    id: number,
    title: string,
    description?: string,
    url?: string,
    startDate: string,
    endDate?: string
}