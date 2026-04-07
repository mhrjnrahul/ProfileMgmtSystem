export interface SkillFrequency {
  name: string;
  count: number;
}

export interface RecentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalEducationRecords: number;
  totalWorkExperienceRecords: number;
  totalProjects: number;
  totalSocialLinks: number;
  topSkills: SkillFrequency[];
  recentUsers: RecentUser[];
}