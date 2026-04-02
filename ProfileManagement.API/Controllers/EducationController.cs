using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProfileManagement.API.DTOs.Education;
using ProfileManagement.API.Services.Interfaces;

namespace ProfileManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EducationController : ControllerBase
    {
        private readonly IEducationService _educationService;
        private readonly IHttpContextAccessor _contextAccessor;


        public EducationController(IEducationService educationService, IHttpContextAccessor contextAccessor)
        {
            _educationService = educationService;
            _contextAccessor = contextAccessor;
        }


        [HttpGet]
        public async Task<IActionResult> GetUserEducationsAsync()
        {
            var userId = _contextAccessor.HttpContext!.User
    .FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            var educations = await _educationService.GetUserEducationsAsync(userId);
            return Ok(educations);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var userId = _contextAccessor.HttpContext!.User
    .FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;

            
            var educations = await _educationService.GetByIdAsync(id, userId);
            return educations == null ? NotFound(new { message = "Education not found" }) : Ok(educations);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateEducationRequest request)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;

            var (success, message, data) = await _educationService.CreateAsync(request, userId);
            if (!success) return BadRequest(new { message });
            return CreatedAtAction(nameof(GetByIdAsync), new { id = data!.Id }, data);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(int id, UpdateEducationRequest request)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            
            var educations = await _educationService.UpdateAsync(id, request, userId);
            return educations.Success ? Ok(educations) : BadRequest(educations);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id) 
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;

            
            var educations = await _educationService.DeleteAsync(id, userId);
            return educations.Success ? Ok(new { message = educations.Message }) : BadRequest(new { message = educations.Message });
        }

        [HttpGet("public/{userId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicEducationsAsync(string userId)
        {
            var educations = await _educationService.GetPublicEducationsAsync(userId);
            return Ok(educations);
        }
    }
}
