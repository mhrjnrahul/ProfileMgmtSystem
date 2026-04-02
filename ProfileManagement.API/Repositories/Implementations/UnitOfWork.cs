using ProfileManagement.API.Data;
using ProfileManagement.API.Repositories.Interfaces;

namespace ProfileManagement.API.Repositories.Implementations
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public IEducationRepository Educations { get; }
        public ISkillRepository Skills { get; }
        public IWorkExperienceRepository WorkExperiences { get; }
        public IProjectRepository Projects { get; }
        public ISocialLinkRepository SocialLinks { get; }

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            Educations = new EducationRepository(context);
            Skills = new SkillRepository(context);
            WorkExperiences = new WorkExperienceRepository(context);
            Projects = new ProjectRepository(context);
            SocialLinks = new SocialLinkRepository(context);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}