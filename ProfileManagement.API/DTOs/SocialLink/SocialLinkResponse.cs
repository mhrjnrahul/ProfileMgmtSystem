namespace ProfileManagement.API.DTOs.SocialLink
{
    public class SocialLinkResponse
    {
        public int Id { get; set; }
        public SocialPlatform Platform { get; set; }
        public string Url { get; set; } = null!;
    }
}
