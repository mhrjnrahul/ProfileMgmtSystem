using ProfileManagement.API.Enums;

namespace ProfileManagement.API.DTOs.Skill
{
    public class UpdateSkillRequest
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ProficiencyLevel ProficiencyLevel { get; set; }
    }
}
