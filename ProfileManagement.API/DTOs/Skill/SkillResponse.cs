using ProfileManagement.API.Enums;

namespace ProfileManagement.API.DTOs.Skill
{
    public class SkillResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ProficiencyLevel ProficiencyLevel { get; set; }
    }
}
