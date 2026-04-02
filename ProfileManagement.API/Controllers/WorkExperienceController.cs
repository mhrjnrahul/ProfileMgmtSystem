using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProfileManagement.API.DTOs.WorkExperience;
using ProfileManagement.API.Services.Interfaces;

namespace ProfileManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WorkExperienceController : ControllerBase
    {
        private readonly IWorkExperienceService _workExperienceService;
        private readonly IHttpContextAccessor _contextAccessor;

        public WorkExperienceController(IWorkExperienceService workExperienceService, IHttpContextAccessor contextAccessor)
        {
            _workExperienceService = workExperienceService;
            _contextAccessor = contextAccessor;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserWorkExperiencesAsync()
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            var workExperiences = await _workExperienceService.GetUserWorkExperiencesAsync(userId);
            return Ok(workExperiences);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            var workExperience = await _workExperienceService.GetByIdAsync(id, userId);
            return workExperience == null ? NotFound(new { message = "Work experience not found" }) : Ok(workExperience);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateWorkExperienceRequest request)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            var (success, message, data) = await _workExperienceService.CreateAsync(request, userId);
            if (!success) return BadRequest(new { message });
            return CreatedAtAction(nameof(GetByIdAsync), new { id = data!.Id }, data);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(int id, UpdateWorkExperienceRequest request)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            var (success, message, data) = await _workExperienceService.UpdateAsync(id, request, userId);
            if (!success) return BadRequest(new { message });
            return Ok(data);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            var (success, message) = await _workExperienceService.DeleteAsync(id, userId);
            if (!success) return BadRequest(new { message });
            return NoContent();
        }

        [HttpGet("public/{userId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicWorkExperiencesAsync(string userId)
        {
            var workExperiences = await _workExperienceService.GetUserWorkExperiencesAsync(userId);
            return Ok(workExperiences);
        }
    }
}
