using ProfileManagement.API.DTOs.Skill;

namespace ProfileManagement.API.Services.Interfaces
{
    public interface ISkillService
    {
        Task<IEnumerable<SkillResponse>> GetUserSkillsAsync(string userId);
        Task<SkillResponse?> GetByIdAsync(int id, string userId);
        Task<(bool Success, string Message, SkillResponse? Data)> CreateAsync(CreateSkillRequest request, string userId);
        Task<(bool Success, string Message, SkillResponse? Data)> UpdateAsync(int id, UpdateSkillRequest request, string userId);
        Task<(bool Success, string Message)> DeleteAsync(int id, string userId);
        Task<IEnumerable<SkillResponse>> GetPublicSkillsAsync(string userId);
    }
}
