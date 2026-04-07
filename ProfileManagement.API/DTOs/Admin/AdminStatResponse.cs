namespace ProfileManagement.API.DTOs.Admin
{
    public class AdminStatsResponse
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int InactiveUsers { get; set; }
        public int TotalEducationRecords { get; set; }
        public int TotalWorkExperienceRecords { get; set; }
        public int TotalProjects { get; set; }
        public int TotalSocialLinks { get; set; }
        public List<SkillFrequency> TopSkills { get; set; } = new();
        public List<RecentUser> RecentUsers { get; set; } = new();
    }

    public class SkillFrequency
    {
        public string Name { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class RecentUser
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}