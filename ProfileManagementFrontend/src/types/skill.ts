export  interface SkillResponse {
    id: number;
    name: string;
    proficiencyLevel: number;
} 

export interface CreateSkillRequest {
    name: string;
    proficiencyLevel: number;
}

export interface UpdateSkillRequest {
    id: number;
    name: string;
    proficiencyLevel: number;
}