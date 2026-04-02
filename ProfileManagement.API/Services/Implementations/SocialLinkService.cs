using AutoMapper;
using ProfileManagement.API.DTOs.SocialLink;
using ProfileManagement.API.Entities;
using ProfileManagement.API.Services.Interfaces;

namespace ProfileManagement.API.Services.Implementations
{
    public class SocialLinkService : ISocialLinkService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public SocialLinkService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SocialLinkResponse>> GetUsersSocialLinksAsync(string userId)
        {
            var socialLinks = await _unitOfWork.SocialLinks.GetAllAsync();
            return socialLinks.Where(sl => sl.UserId == userId)
                              .Select(sl => _mapper.Map<SocialLinkResponse>(sl))
                              .ToList();
        }

        public async Task<SocialLinkResponse?> GetByIdAsync(int id, string userId)
        {
            var socialLink = await _unitOfWork.SocialLinks.GetByIdAsync(id);
            if (socialLink == null || socialLink.UserId != userId)
                return null;
            return _mapper.Map<SocialLinkResponse>(socialLink);
        }

        public async Task<(bool Success, string Message, SocialLinkResponse? Data)> CreateAsync(CreateSocialLinkRequest request, string userId)
        {
            var entity = _mapper.Map<Entities.SocialLink>(request);
            entity.UserId = userId;
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SocialLinks.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            var response = _mapper.Map<SocialLinkResponse>(entity);
            return (true, "Social link created successfully.", response);
        }

        public async Task<(bool Success, string Message, SocialLinkResponse? Data)> UpdateAsync(int id, UpdateSocialLinkRequest request, string userId)
        {
            var socialLink = await _unitOfWork.SocialLinks.GetByIdAsync(id);
            if (socialLink == null || socialLink.UserId != userId)
                return (false, "Social link not found.", null);
            _mapper.Map(request, socialLink);
            socialLink.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            var response = _mapper.Map<SocialLinkResponse>(socialLink);
            return (true, "Social link updated successfully.", response);
        }

        public async Task<(bool Success, string Message)> DeleteAsync(int id, string userId)
        {
            var socialLink = await _unitOfWork.SocialLinks.GetByIdAsync(id);
            if(socialLink == null || socialLink.UserId != userId)
                return (false, "Social link not found.");
            _unitOfWork.SocialLinks.Delete(socialLink);
            await _unitOfWork.SaveChangesAsync();
            return (true, "Social link deleted successfully.");
        }

        public async Task<IEnumerable<SocialLinkResponse>> GetPublicSocialLinksAsync(string userId)
        {
            var socialLinks = await _unitOfWork.SocialLinks.GetAllAsync();
            return socialLinks.Where(sl => sl.UserId == userId)
                              .Select(sl => _mapper.Map<SocialLinkResponse>(sl));
        }
    }
}
