using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProfileManagement.API.DTOs.Skill;
using ProfileManagement.API.Services.Interfaces;

namespace ProfileManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SkillController : ControllerBase
    {
        private readonly ISkillService _skillService;
        private readonly IHttpContextAccessor _contextAccessor;

        public SkillController(ISkillService skillService, IHttpContextAccessor contextAccessor)
        {
            _skillService = skillService;
            _contextAccessor = contextAccessor;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserSkillsAsync()
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            var skills = await _skillService.GetUserSkillsAsync(userId);
            return Ok(skills);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            var skill = await _skillService.GetByIdAsync(id, userId);
            return skill == null ? NotFound(new { message = "Skill not found" }) : Ok(skill);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateSkillRequest request)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            var (success, message, data) = await _skillService.CreateAsync(request, userId);
            if (!success) return BadRequest(new { message });
            return CreatedAtAction(nameof(GetByIdAsync), new { id = data!.Id }, data);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(int id, UpdateSkillRequest request)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            var (success, message, data) = await _skillService.UpdateAsync(id, request, userId);
            if (!success) return BadRequest(new { message });
            return Ok(data);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            var (success, message) = await _skillService.DeleteAsync(id, userId);
            if (!success) return BadRequest(new { message });
            return NoContent();
        }

        [HttpGet("public/{userId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicSkillsAsync(string userId)
        {
            var skills = await _skillService.GetPublicSkillsAsync(userId);
            return Ok(skills);
        }
    }
}
