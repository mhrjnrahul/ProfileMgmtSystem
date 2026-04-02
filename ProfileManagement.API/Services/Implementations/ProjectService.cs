using AutoMapper;
using ProfileManagement.API.DTOs.Project;
using ProfileManagement.API.Services.Interfaces;

namespace ProfileManagement.API.Services.Implementations
{
    public class ProjectService : IProjectService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProjectService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ProjectResponse>> GetProjectsByUserIdAsync(string userId)
        {
            var projects = await _unitOfWork.Projects.GetAllAsync();
            return projects.Where(p => p.UserId == userId)
                           .Select(p => _mapper.Map<ProjectResponse>(p))
                           .ToList();
        }

        public async Task<ProjectResponse?> GetProjectByIdAsync(int id, string userId)
        {
            var project = await _unitOfWork.Projects.GetByIdAsync(id);

            if (project == null || project.UserId != userId)
                return null;

            return _mapper.Map<ProjectResponse>(project);
        }

        public async Task<(bool Success, string Message, ProjectResponse? Data)> CreateProjectAsync(CreateProjectRequest request, string userId)
        {
            var entity = _mapper.Map<Entities.Project>(request);
            entity.UserId = userId;
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.Projects.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            var response = _mapper.Map<ProjectResponse>(entity);
            return (true, "Project created successfully", response);
        }

        public async Task<(bool Success, string Message, ProjectResponse? Data)> UpdateProjectAsync(int id, UpdateProjectRequest request, string userId)
        {
            var project = await _unitOfWork.Projects.GetByIdAsync(id);
            if (project == null || project.UserId != userId)
                return (false, "Project not found or access denied", null);
            _mapper.Map(request, project);
            project.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            var response = _mapper.Map<ProjectResponse>(project);
            return (true, "Project updated successfully", response);
        }

        public async Task<(bool Success, string Message)> DeleteProjectAsync(int id, string userId)
        {
            var project = await _unitOfWork.Projects.GetByIdAsync(id);
            if (project == null || project.UserId != userId)
                return (false, "Project not found or access denied");
            _unitOfWork.Projects.Delete(project);
            await _unitOfWork.SaveChangesAsync();
            return (true, "Project deleted successfully");
        }

        public async Task<IEnumerable<ProjectResponse>> GetPublicProjectsAsync(string userId)
        {
            var projects = await _unitOfWork.Projects.GetAllAsync();
            return projects.Where(p => p.UserId == userId)
                           .Select(p => _mapper.Map<ProjectResponse>(p));
        }
    }
}
