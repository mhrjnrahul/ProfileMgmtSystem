using ProfileManagement.API.DTOs.Admin;

namespace ProfileManagement.API.Services.Interfaces
{
    public interface IAdminService
    {
        Task<AdminStatsResponse> GetStatsAsync();
    }
}