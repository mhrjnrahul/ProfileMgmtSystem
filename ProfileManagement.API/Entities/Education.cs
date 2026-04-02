namespace ProfileManagement.API.Entities
{
    public class Education : BaseEntity
    {
        public string Institution { get; set; } = null!;
        public string Degree { get; set; } = null!;
        public string FieldOfStudy { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Description { get; set; }

        //navigation prop + foreign key
        public string UserId { get; set; } = null!;

        public ApplicationUser User { get; set; } = null!;
    }
}
