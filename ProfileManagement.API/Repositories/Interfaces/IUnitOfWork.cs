using ProfileManagement.API.Repositories.Interfaces;

public interface IUnitOfWork
{
    IEducationRepository Educations { get; }
    ISkillRepository Skills { get; }
    IWorkExperienceRepository WorkExperiences { get; }
    IProjectRepository Projects { get; }
    ISocialLinkRepository SocialLinks { get; }
    Task SaveChangesAsync();
}