using ProfileManagement.API.Data;
using ProfileManagement.API.Entities;
using ProfileManagement.API.Repositories.Interfaces;
namespace ProfileManagement.API.Repositories.Implementations
{
    public class SkillRepository : Repository<Skill>, ISkillRepository
    {
        public SkillRepository(AppDbContext context) : base(context) { }
    }
}
