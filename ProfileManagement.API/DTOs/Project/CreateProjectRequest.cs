namespace ProfileManagement.API.DTOs.Project
{
    public class CreateProjectRequest
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string? Url { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

    }
}
