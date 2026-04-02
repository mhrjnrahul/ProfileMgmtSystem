namespace ProfileManagement.API.Entities
{
    public class SocialLink : BaseEntity
    {
        public SocialPlatform Platform { get; set; }
        public string Url { get; set; } = null!;
        // Foreign key to ApplicationUser
        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    
    }
}
