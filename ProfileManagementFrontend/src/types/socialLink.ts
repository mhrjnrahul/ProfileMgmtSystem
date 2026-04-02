export interface SocialLinkResponse {
    id: number,
    platform: number,
    url: string
}

export interface CreateSocialLinkRequest {
    platform: number,
    url: string
}

export interface UpdateSocialLinkRequest {
    id: number,
    platform: number,
    url: string
}