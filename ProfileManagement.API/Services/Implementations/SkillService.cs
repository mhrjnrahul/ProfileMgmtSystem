using AutoMapper;
using ProfileManagement.API.DTOs.Skill;
using ProfileManagement.API.Services.Interfaces;

namespace ProfileManagement.API.Services.Implementations
{
    public class SkillService : ISkillService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public SkillService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SkillResponse>> GetUserSkillsAsync(string userId)
        {
            var skills = await _unitOfWork.Skills.GetAllAsync();
            return skills.Where(s => s.UserId == userId)
                         .Select(s => _mapper.Map<SkillResponse>(s))
                         .ToList();
        }

        public async Task<SkillResponse?> GetByIdAsync(int id, string userId)
        {
            var skill = await _unitOfWork.Skills.GetByIdAsync(id);
            if (skill == null || skill.UserId != userId)
                return null;
            return _mapper.Map<SkillResponse>(skill);
        }

        public async Task<(bool Success, string Message, SkillResponse? Data)> CreateAsync(CreateSkillRequest request, string userId)
        {
            var entity = _mapper.Map<Entities.Skill>(request);
            entity.UserId = userId;
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.Skills.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            var response = _mapper.Map<SkillResponse>(entity);
            return (true, "Skill created successfully", response);
        }

        public async Task<(bool Success, string Message, SkillResponse? Data)> UpdateAsync(int id, UpdateSkillRequest request, string userId)
        {
            var skill = await _unitOfWork.Skills.GetByIdAsync(id);
            if (skill == null || skill.UserId != userId)
                return (false, "Skill not found", null);
            _mapper.Map(request, skill);
            skill.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            var response = _mapper.Map<SkillResponse>(skill);
            return (true, "Skill updated successfully", response);
        }

        public async Task<(bool Success, string Message)> DeleteAsync(int id, string userId)
        {
            var skill = await _unitOfWork.Skills.GetByIdAsync(id);
            if (skill == null || skill.UserId != userId)
                return (false, "Skill not found");
            _unitOfWork.Skills.Delete(skill);
            await _unitOfWork.SaveChangesAsync();
            return (true, "Skill deleted successfully");

        }

        public async Task<IEnumerable<SkillResponse>> GetPublicSkillsAsync(string userId)
        {
            var skills = await _unitOfWork.Skills.GetAllAsync();
            return skills.Where(s => s.UserId == userId)
                         .Select(s => _mapper.Map<SkillResponse>(s));
        }
    }
}
