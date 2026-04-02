using ProfileManagement.API.Enums;

namespace ProfileManagement.API.DTOs.Skill
{
    public class CreateSkillRequest
    {
        public string Name { get; set; } = string.Empty;
        public ProficiencyLevel Proficiency { get; set; }
    }
}
