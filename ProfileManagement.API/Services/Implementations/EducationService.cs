using AutoMapper;
using ProfileManagement.API.DTOs.Education;
using ProfileManagement.API.Entities;
using ProfileManagement.API.Services.Interfaces;


namespace ProfileManagement.API.Services.Implementations
{
    public class EducationService : IEducationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public EducationService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<EducationResponse>> GetUserEducationsAsync(string userId)
        {
            var educations = await _unitOfWork.Educations.GetAllAsync();

            return educations
                .Where(e => e.UserId == userId)
                .Select(e => _mapper.Map<EducationResponse>(e));
        }

        public async Task<EducationResponse?> GetByIdAsync(int id, string userId)
        {
            var education = await _unitOfWork.Educations.GetByIdAsync(id);

            // null check + ownership check in one line
            if (education == null || education.UserId != userId)
                return null;

            return _mapper.Map<EducationResponse>(education);
        }

        public async Task<(bool Success, string Message, EducationResponse? Data)> CreateAsync(CreateEducationRequest request, string userId)
        {
            // map DTO → entity
            var entity = _mapper.Map<Education>(request);

            // set fields AutoMapper can't know
            entity.UserId = userId;
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Educations.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();

            // map saved entity → response DTO
            var response = _mapper.Map<EducationResponse>(entity);
            return (true, "Education created successfully", response);
        }

        public async Task<(bool Success, string Message, EducationResponse? Data)> UpdateAsync(int id, UpdateEducationRequest request, string userId)
        {
            var education = await _unitOfWork.Educations.GetByIdAsync(id);

            if (education == null)
                return (false, "Education not found", null);

            if (education.UserId != userId)
                return (false, "Unauthorized", null);

            // map request fields onto existing entity
            _mapper.Map(request, education);
            education.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Educations.Update(education);
            await _unitOfWork.SaveChangesAsync();

            var response = _mapper.Map<EducationResponse>(education);
            return (true, "Education updated successfully", response);
        }

        public async Task<(bool Success, string Message)> DeleteAsync(int id, string userId)
        {
            var education = await _unitOfWork.Educations.GetByIdAsync(id);

            if (education == null)
                return (false, "Education not found");

            if (education.UserId != userId)
                return (false, "Unauthorized");

            _unitOfWork.Educations.Delete(education);
            await _unitOfWork.SaveChangesAsync();
            return (true, "Education deleted successfully");
        }

        public async Task<IEnumerable<EducationResponse>> GetPublicEducationsAsync(string userId)
        {
            var educations = await _unitOfWork.Educations.GetAllAsync();

            return educations
                .Where(e => e.UserId == userId)
                .Select(e => _mapper.Map<EducationResponse>(e));
        }
    }
}