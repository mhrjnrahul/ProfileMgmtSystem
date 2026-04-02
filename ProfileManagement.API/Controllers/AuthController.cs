using Microsoft.AspNetCore.Authorization;
using ProfileManagement.API.DTOs.Auth;
using Microsoft.AspNetCore.Mvc;
using ProfileManagement.API.Services.Interfaces;

namespace ProfileManagement.API.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]

        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var (success, message, data) = await _authService.RegisterAsync(request);

            if (!success)
            {
                return BadRequest(new { message });
            }

            return Ok(data);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var (success, message, data) = await _authService.LoginAsync(request);
            if (!success)
            {
                return BadRequest(new { message });
            }
            return Ok(data);
        }
    }
}
