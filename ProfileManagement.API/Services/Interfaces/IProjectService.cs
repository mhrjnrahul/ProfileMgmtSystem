using ProfileManagement.API.DTOs.Project;

namespace ProfileManagement.API.Services.Interfaces
{
    public interface IProjectService
    {
        Task <IEnumerable<ProjectResponse>> GetProjectsByUserIdAsync(string userId);
        Task <ProjectResponse?> GetProjectByIdAsync(int id, string userId);
        Task<(bool Success, string Message, ProjectResponse? Data)> CreateProjectAsync(CreateProjectRequest request, string userId);
        Task<(bool Success, string Message, ProjectResponse? Data)> UpdateProjectAsync(int id, UpdateProjectRequest request, string userId);
        Task<(bool Success, string Message)> DeleteProjectAsync(int id, string userId);
        Task<IEnumerable<ProjectResponse>> GetPublicProjectsAsync(string userId);
    }
}
