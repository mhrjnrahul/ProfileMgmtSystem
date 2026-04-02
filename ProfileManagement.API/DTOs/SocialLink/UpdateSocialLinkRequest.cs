
namespace ProfileManagement.API.DTOs.SocialLink
{
    public class UpdateSocialLinkRequest
    {
        public int Id { get; set; }
        public SocialPlatform Platform { get; set; }
        public string Url { get; set; } = null!;
    }
}
