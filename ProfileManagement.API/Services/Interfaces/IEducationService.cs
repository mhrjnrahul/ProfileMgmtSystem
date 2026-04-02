using ProfileManagement.API.DTOs.Education;

namespace ProfileManagement.API.Services.Interfaces
{
    public interface IEducationService
    {
        Task<IEnumerable<EducationResponse>> GetUserEducationsAsync(string userId);
        Task<EducationResponse?> GetByIdAsync(int id, string userId);
        Task<(bool Success, string Message, EducationResponse? Data)> CreateAsync(CreateEducationRequest request, string userId);
        Task<(bool Success, string Message, EducationResponse? Data)> UpdateAsync(int id, UpdateEducationRequest request, string userId);
        Task<(bool Success, string Message)> DeleteAsync(int id, string userId);
        Task<IEnumerable<EducationResponse>> GetPublicEducationsAsync(string userId);
    }
}
