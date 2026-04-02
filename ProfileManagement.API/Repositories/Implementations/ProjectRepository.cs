using ProfileManagement.API.Data;
using ProfileManagement.API.Entities;
using ProfileManagement.API.Repositories.Interfaces;
namespace ProfileManagement.API.Repositories.Implementations
{
    public class ProjectRepository : Repository<Project>, IProjectRepository
    {
        public ProjectRepository(AppDbContext context) : base(context) { }
    }
}