using ProfileManagement.API.Enums;

namespace ProfileManagement.API.Entities
{
    public class Skill : BaseEntity
    {
        public string Name { get; set; } = null!;
        public ProficiencyLevel Proficiency { get; set; } = ProficiencyLevel.Beginner;
        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    }
}
