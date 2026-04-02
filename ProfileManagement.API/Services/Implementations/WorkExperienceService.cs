using AutoMapper;
using ProfileManagement.API.DTOs.WorkExperience;
using ProfileManagement.API.Services.Interfaces;

namespace ProfileManagement.API.Services.Implementations
{
    public class WorkExperienceService : IWorkExperienceService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public WorkExperienceService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<WorkExperienceResponse>> GetUserWorkExperiencesAsync(string userId)
        {
            var workExperiences = await _unitOfWork.WorkExperiences.GetAllAsync();
            return workExperiences
                .Where(we => we.UserId == userId)
                .Select(we => _mapper.Map<WorkExperienceResponse>(we))
                .ToList();
        }

        public async Task<WorkExperienceResponse?> GetByIdAsync(int id, string userId)
        {
            var workExperience = await _unitOfWork.WorkExperiences.GetByIdAsync(id);
            if (workExperience == null || workExperience.UserId != userId)
                return null;
            return _mapper.Map<WorkExperienceResponse>(workExperience);
        }

        public async Task<(bool Success, string Message, WorkExperienceResponse? Data)> CreateAsync(CreateWorkExperienceRequest request, string userId)
        {
            var entity = _mapper.Map<Entities.WorkExperience>(request);
            entity.UserId = userId;
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.WorkExperiences.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            var response = _mapper.Map<WorkExperienceResponse>(entity);
            return (true, "Work experience created successfully", response);
        }

        public async Task<(bool Success, string Message, WorkExperienceResponse? Data)> UpdateAsync(int id, UpdateWorkExperienceRequest request, string userId)
        {
            var workExperience = await _unitOfWork.WorkExperiences.GetByIdAsync(id);
            if (workExperience == null || workExperience.UserId != userId)
                return (false, "Work experience not found", null);
            _mapper.Map(request, workExperience);
            workExperience.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            var response = _mapper.Map<WorkExperienceResponse>(workExperience);
            return (true, "Work experience updated successfully", response);
        }

        public async Task<(bool Success, string Message)> DeleteAsync(int id, string userId)
        {
            var workExperience = await _unitOfWork.WorkExperiences.GetByIdAsync(id);
            if (workExperience == null || workExperience.UserId != userId)
                return (false, "Work experience not found");
            _unitOfWork.WorkExperiences.Delete(workExperience);
            await _unitOfWork.SaveChangesAsync();
            return (true, "Work experience deleted successfully");
        }

        public async Task<IEnumerable<WorkExperienceResponse>> GetPublicWorkExperiencesAsync(string userId)
        {
            var workExperiences = await _unitOfWork.WorkExperiences.GetAllAsync();

            return workExperiences
                .Where(we => we.UserId == userId)
                .Select(we => _mapper.Map<WorkExperienceResponse>(we));
        }
    }
}
