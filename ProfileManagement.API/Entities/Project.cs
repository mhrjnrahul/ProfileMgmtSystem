namespace ProfileManagement.API.Entities
{
    public class Project : BaseEntity
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string? Url { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    }
}
