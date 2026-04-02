using ProfileManagement.API.Data;
using ProfileManagement.API.Entities;
using ProfileManagement.API.Repositories.Interfaces;
namespace ProfileManagement.API.Repositories.Implementations
{
    public class WorkExperienceRepository : Repository<WorkExperience>, IWorkExperienceRepository
    {
        public WorkExperienceRepository(AppDbContext context) : base(context) { }
    }
}