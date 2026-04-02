namespace ProfileManagement.API.Entities
{
    public class WorkExperience : BaseEntity
    {
        public string Company { get; set; } = null!;
        public string Position { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Description { get; set; }
        public bool IsCurrent { get; set; } = false;    

        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    }
}
