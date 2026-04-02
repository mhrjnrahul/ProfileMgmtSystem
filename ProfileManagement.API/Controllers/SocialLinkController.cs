using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Win32.SafeHandles;
using ProfileManagement.API.DTOs.SocialLink;
using ProfileManagement.API.Services.Interfaces;

namespace ProfileManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SocialLinkController : ControllerBase
    {
        private readonly ISocialLinkService _socialLinkService;
        private readonly IHttpContextAccessor _contextAccessor;

        public SocialLinkController(ISocialLinkService socialLinkService, IHttpContextAccessor contextAccessor)
        {
            _socialLinkService = socialLinkService;
            _contextAccessor = contextAccessor;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsersSocialLinks()
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }
            var socialLinks = await _socialLinkService.GetUsersSocialLinksAsync(userId);
            return Ok(socialLinks);

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }
            var socialLink = await _socialLinkService.GetByIdAsync(id, userId);
            return socialLink == null ? NotFound(new { message = "Social link not found" }) : Ok(socialLink);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateSocialLinkRequest request)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }
            var (success, message, data) = await _socialLinkService.CreateAsync(request, userId);
            if (!success) return BadRequest(new { message });
            return CreatedAtAction(nameof(GetByIdAsync), new { id = data!.Id }, data);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(int id, UpdateSocialLinkRequest request)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }
            var (success, message, data) = await _socialLinkService.UpdateAsync(id, request, userId);
            if (!success) return BadRequest(new { message });
            return Ok(data);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var userId = _contextAccessor.HttpContext!.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }
            var (success, message) = await _socialLinkService.DeleteAsync(id, userId);
            if (!success) return BadRequest(new { message });
            return NoContent();
        }

        [HttpGet("public/{userId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicSocialLinksAsync(string userId)
        {
            var socialLinks = await _socialLinkService.GetPublicSocialLinksAsync(userId);
            return Ok(socialLinks);
        }
    }
}
