using ProfileManagement.API.DTOs.WorkExperience;

namespace ProfileManagement.API.Services.Interfaces
{
    public interface IWorkExperienceService
    {
        Task<IEnumerable<WorkExperienceResponse>> GetUserWorkExperiencesAsync(string userId);
        Task<WorkExperienceResponse?> GetByIdAsync(int id, string userId);
        Task<(bool Success, string Message, WorkExperienceResponse? Data)> CreateAsync(CreateWorkExperienceRequest request, string userId);
        Task<(bool Success, string Message, WorkExperienceResponse? Data)> UpdateAsync(int id, UpdateWorkExperienceRequest request, string userId);
        Task<(bool Success, string Message)> DeleteAsync(int id, string userId);
        Task<IEnumerable<WorkExperienceResponse>> GetPublicWorkExperiencesAsync(string userId);
    }
}
