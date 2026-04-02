using AutoMapper;
using Microsoft.AspNetCore.Identity;
using ProfileManagement.API.DTOs.Profile;
using ProfileManagement.API.Entities;
using ProfileManagement.API.Services.Interfaces;

namespace ProfileManagement.API.Services.Implementations
{
    public class ProfileService : IProfileService
    {
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfileService(IMapper mapper, UserManager<ApplicationUser> userManager)
        {
            _mapper = mapper;
            _userManager = userManager;
        }

        public async Task<IEnumerable<ProfileResponse>> GetAllUserProfilesAsync()
        {
            var users = _userManager.Users.ToList();
            return _mapper.Map<List<ProfileResponse>>(users);
        }

        public async Task<ProfileResponse?> GetUserProfileByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return user == null ? null : _mapper.Map<ProfileResponse>(user);
        }

        public async Task<(bool Success, string Message, ProfileResponse? Data)> UpdateProfileAsync(string userId, UpdateProfileRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return (false, "User not found", null);
            _mapper.Map(request, user);
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return (false, "Failed to update profile", null);
            return (true, "Profile updated successfully", _mapper.Map<ProfileResponse>(user));
        }

        public async Task<(bool Success, string Message)> DeactivateProfileAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return (false, "User not found");

            user.IsActive = false;
            var result = await _userManager.UpdateAsync(user);
            if(!result.Succeeded)
                return (false, "Failed to deactivate profile");
            return (true, "Profile deactivated successfully");
        }

        public async Task<IEnumerable<ProfileResponse>> SearchUsersAsync(
    string? name,
    string? skill,
    string? city,
    string? country,
    string? role,
    bool? isActive)
        {
            var users = _userManager.Users.AsQueryable();

            if (!string.IsNullOrEmpty(name))
                users = users.Where(u =>
                    u.FirstName.Contains(name) ||
                    u.LastName.Contains(name));

            if (!string.IsNullOrEmpty(city))
                users = users.Where(u => u.City != null && u.City.Contains(city));

            if (!string.IsNullOrEmpty(country))
                users = users.Where(u => u.Country != null && u.Country.Contains(country));

            if (isActive.HasValue)
                users = users.Where(u => u.IsActive == isActive.Value);

            var userList = users.ToList();

            

            if (!string.IsNullOrEmpty(role))
            {
                var usersInRole = await _userManager.GetUsersInRoleAsync(role);
                var roleUserIds = usersInRole.Select(u => u.Id).ToHashSet();
                userList = userList.Where(u => roleUserIds.Contains(u.Id)).ToList();
            }

            return _mapper.Map<IEnumerable<ProfileResponse>>(userList);
        }
    }
}
