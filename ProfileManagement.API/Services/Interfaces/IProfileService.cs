using ProfileManagement.API.DTOs.Profile;

namespace ProfileManagement.API.Services.Interfaces
{
    public interface IProfileService
    {
        Task<IEnumerable<ProfileResponse>> GetAllUserProfilesAsync();
        Task<ProfileResponse?> GetUserProfileByIdAsync(string userId);
        Task<(bool Success, string Message, ProfileResponse? Data)> UpdateProfileAsync(string userId, UpdateProfileRequest request);
        Task<(bool Success, string Message)> DeactivateProfileAsync(string userId);
        Task<IEnumerable<ProfileResponse>> SearchUsersAsync(
    string? name,
    string? skill,
    string? city,
    string? country,
    string? role,
    bool? isActive
);
    }
}