using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using ProfileManagement.API.DTOs.Auth;
using ProfileManagement.API.Entities;
using ProfileManagement.API.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProfileManagement.API.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AuthService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        private string GenerateJwtToken(ApplicationUser user, string role)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(ClaimTypes.Email, user.Email!),
        new Claim(ClaimTypes.GivenName, user.FirstName),
        new Claim(ClaimTypes.Surname, user.LastName),
        new Claim(ClaimTypes.Role, role)
    };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    double.Parse(jwtSettings["ExpiryMinutes"]!)),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<(bool Success, string Message, AuthResponse? Data)> RegisterAsync(RegisterRequest request)
        {
            var userExists = await _userManager.FindByNameAsync(request.Email);
            if (userExists != null)
                return (false, "User already exists!", null);

            //create new user
            ApplicationUser user = new()
            {
                Email = request.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName
            };

            //create user
            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
                return (false, "User creation failed! Please check user details and try again.", null);

            if (!await _roleManager.RoleExistsAsync("User"))
                await _roleManager.CreateAsync(new IdentityRole("User"));

            await _userManager.AddToRoleAsync(user, "User");
            var role = "User";
            var token = GenerateJwtToken(user, role);
            return (true, "User created successfully!", new AuthResponse
            {
                Token = token,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = role
            });
        }

        public async Task<(bool Success, string Message, AuthResponse? Data)> LoginAsync(LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if(user == null) return (false, "User not found!", null);

            //check password
            if (!await _userManager.CheckPasswordAsync(user, request.Password))
                return (false, "Invalid password!", null);

            //check IsActive
            if (!user.IsActive)
                return (false, "User account is inactive!", null);

            //generate token
            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "User";
            var token = GenerateJwtToken(user, role);

            return (true, "Login successful!", new AuthResponse
            {
                Token = token,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = role
            });

        }
    }
}
