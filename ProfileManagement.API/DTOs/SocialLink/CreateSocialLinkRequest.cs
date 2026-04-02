namespace ProfileManagement.API.DTOs.SocialLink
{
    public class CreateSocialLinkRequest
    {
        public SocialPlatform Platform { get; set; }
        public string Url { get; set; } = null!;    
    }
}
