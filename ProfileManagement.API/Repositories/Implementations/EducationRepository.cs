using ProfileManagement.API.Data;
using ProfileManagement.API.Entities;
using ProfileManagement.API.Repositories.Interfaces;
namespace ProfileManagement.API.Repositories.Implementations
{
    public class EducationRepository : Repository<Education>, IEducationRepository
    {
        public EducationRepository(AppDbContext context) : base(context) { }
    }
}