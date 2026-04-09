using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProfileManagement.API.DTOs.Profile;
using ProfileManagement.API.Services.Interfaces;
using static System.Net.WebRequestMethods;

namespace ProfileManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;
        private readonly IHttpContextAccessor _contextAccessor;

        public ProfileController(IProfileService profileService, IHttpContextAccessor contextAccessor)
        {
            _profileService = profileService;
            _contextAccessor = contextAccessor;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllUserProfiles()
        {
            var users = await _profileService.GetAllUserProfilesAsync();
            return Ok(users);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = _contextAccessor.HttpContext!.User
                .FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!; if (userId == null)
                return Unauthorized();

            var profile = await _profileService.GetUserProfileByIdAsync(userId);
            if (profile == null)
                return NotFound();

            return Ok(profile);
        }

        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request)
        {
            var userId = _contextAccessor.HttpContext!.User
                .FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            if (userId == null)
                return Unauthorized();
            var result = await _profileService.UpdateProfileAsync(userId, request);
            if (!result.Success)
                return BadRequest(new { message = result.Message });
            return Ok(result.Data);
        }

        [HttpGet("{userId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProfileById(string userId)
        {
            var profile = await _profileService.GetUserProfileByIdAsync(userId);
            if (profile == null)
                return NotFound();
            return Ok(profile);
        }

        [HttpPut("{userId}/deactivate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeactivateProfile(string userId)
        {
            var result = await _profileService.DeactivateProfileAsync(userId);
            if (!result.Success)
                return BadRequest(result.Message);
            return Ok(new { message = result.Message });
        }

        [HttpPut("{userId}/reactivate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ReactivateProfile(string userId)
        {
            var result = await _profileService.ReactivateProfileAsync(userId);
            if (!result.Success)
                return BadRequest(result.Message);
            return Ok(new { message = result.Message });
        }

        [HttpGet("search")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SearchUsers(
    [FromQuery] string? name,
    [FromQuery] string? city,
    [FromQuery] string? country,
    [FromQuery] string? role,
    [FromQuery] bool? isActive)
        {
            var users = await _profileService.SearchUsersAsync(name, null, city, country, role, isActive);
            return Ok(users);
        }

    }
}
