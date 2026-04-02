using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProfileManagement.API.DTOs.Project;
using ProfileManagement.API.Services.Interfaces;

namespace ProfileManagement.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly IHttpContextAccessor _contextAccessor;

        public ProjectController(IProjectService projectService, IHttpContextAccessor contextAccessor)
        {
            _projectService = projectService;
            _contextAccessor = contextAccessor;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsersProjectAsync()
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            var projects = await _projectService.GetProjectsByUserIdAsync(userId);
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            var project = await _projectService.GetProjectByIdAsync(id, userId);
            return project == null ? NotFound(new { message = "Project not found" }) : Ok(project);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateProjectRequest request)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            var (success, message, data) = await _projectService.CreateProjectAsync(request, userId);
            if (!success) return BadRequest(new { message });
            return CreatedAtAction(nameof(GetByIdAsync), new { id = data!.Id }, data);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(int id, UpdateProjectRequest request)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            var (success, message, data) = await _projectService.UpdateProjectAsync(id, request, userId);
            if (!success) return BadRequest(new { message });
            return Ok(data);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            var (success, message) = await _projectService.DeleteProjectAsync(id, userId);
            if (!success) return BadRequest(new { message });
            return NoContent();
        }

        [HttpGet("public/{userId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicProjectsByUserIdAsync(string userId)
        {
            var projects = await _projectService.GetPublicProjectsAsync(userId);
            return Ok(projects);
        }
    }
}
