using ProfileManagement.API.DTOs.Auth;

namespace ProfileManagement.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<(bool Success, string Message, AuthResponse? Data)> RegisterAsync(RegisterRequest request);
        Task<(bool Success, string Message, AuthResponse? Data)> LoginAsync(LoginRequest request);
    }
}