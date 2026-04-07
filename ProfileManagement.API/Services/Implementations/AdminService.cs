using Microsoft.AspNetCore.Identity;
using ProfileManagement.API.DTOs.Admin;
using ProfileManagement.API.Entities;
using ProfileManagement.API.Repositories.Interfaces;
using ProfileManagement.API.Services.Interfaces;

namespace ProfileManagement.API.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;

        public AdminService(UserManager<ApplicationUser> userManager, IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _unitOfWork = unitOfWork;
        }

        public async Task<AdminStatsResponse> GetStatsAsync()
        {
            var users = _userManager.Users.ToList();
            var educations = await _unitOfWork.Educations.GetAllAsync();
            var workExperiences = await _unitOfWork.WorkExperiences.GetAllAsync();
            var projects = await _unitOfWork.Projects.GetAllAsync();
            var socialLinks = await _unitOfWork.SocialLinks.GetAllAsync();
            var skills = await _unitOfWork.Skills.GetAllAsync();

            // Deduplicate skills by name, count frequency
            var topSkills = skills
                .GroupBy(s => s.Name.Trim().ToLower())
                .Select(g => new SkillFrequency
                {
                    Name = g.First().Name,
                    Count = g.Count()
                })
                .OrderByDescending(s => s.Count)
                .Take(5)
                .ToList();

            // Most recent 5 users by CreatedAt
            var recentUsers = users
                .OrderByDescending(u => u.CreatedAt)
                .Take(5)
                .Select(u => new RecentUser
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email ?? string.Empty,
                    CreatedAt = u.CreatedAt,
                })
                .ToList();

            return new AdminStatsResponse
            {
                TotalUsers = users.Count,
                ActiveUsers = users.Count(u => u.IsActive),
                InactiveUsers = users.Count(u => !u.IsActive),
                TotalEducationRecords = educations.Count(),
                TotalWorkExperienceRecords = workExperiences.Count(),
                TotalProjects = projects.Count(),
                TotalSocialLinks = socialLinks.Count(),
                TopSkills = topSkills,
                RecentUsers = recentUsers,
            };
        }
    }
}