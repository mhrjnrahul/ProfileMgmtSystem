

using ProfileManagement.API.DTOs.SocialLink;

namespace ProfileManagement.API.Services.Interfaces
{
    public interface ISocialLinkService
    {
        Task <IEnumerable<SocialLinkResponse>> GetUsersSocialLinksAsync(string userId);
        Task<SocialLinkResponse?> GetByIdAsync(int id, string userId);
        Task<(bool Success, string Message, SocialLinkResponse? Data)> CreateAsync(CreateSocialLinkRequest request, string userId);
        Task<(bool Success, string Message, SocialLinkResponse? Data)> UpdateAsync(int id, UpdateSocialLinkRequest request, string userId);
        Task<(bool Success, string Message)> DeleteAsync(int id, string userId);
        Task<IEnumerable<SocialLinkResponse>> GetPublicSocialLinksAsync(string userId);
    }
}
