using ProfileManagement.API.Data;
using ProfileManagement.API.Entities;
using ProfileManagement.API.Repositories.Interfaces;
namespace ProfileManagement.API.Repositories.Implementations
{
    public class SocialLinkRepository : Repository<SocialLink>, ISocialLinkRepository
    {
        public SocialLinkRepository(AppDbContext context) : base(context) { }
    }
}