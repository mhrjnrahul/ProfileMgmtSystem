using AutoMapper;
using ProfileManagement.API.DTOs.Education;
using ProfileManagement.API.DTOs.Profile;
using ProfileManagement.API.DTOs.Project;
using ProfileManagement.API.DTOs.Skill;
using ProfileManagement.API.DTOs.SocialLink;
using ProfileManagement.API.DTOs.WorkExperience;
using ProfileManagement.API.Entities;

namespace ProfileManagement.API.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Education MAPS
            CreateMap<Education, EducationResponse>();
            CreateMap<CreateEducationRequest, Education>();
            CreateMap<UpdateEducationRequest, Education>();

            //work experience MAPS
            CreateMap<WorkExperience, WorkExperienceResponse>();
            CreateMap<CreateWorkExperienceRequest, WorkExperience>();
            CreateMap<UpdateWorkExperienceRequest, WorkExperience>();

            //skill maps
            CreateMap<Skill, SkillResponse>()
    .ForMember(dest => dest.ProficiencyLevel, opt => opt.MapFrom(src => src.Proficiency));

            CreateMap<CreateSkillRequest, Skill>()
                .ForMember(dest => dest.Proficiency, opt => opt.MapFrom(src => src.ProficiencyLevel));

            CreateMap<UpdateSkillRequest, Skill>()
                .ForMember(dest => dest.Proficiency, opt => opt.MapFrom(src => src.ProficiencyLevel));

            //project maps
            CreateMap<Project, ProjectResponse>();
            CreateMap<CreateProjectRequest, Project>();
            CreateMap<UpdateProjectRequest, Project>();

            //social link maps
            CreateMap<SocialLink, SocialLinkResponse>();
            CreateMap<CreateSocialLinkRequest, SocialLink>();
            CreateMap<UpdateSocialLinkRequest, SocialLink>();

            //profile maps
            CreateMap<ApplicationUser, ProfileResponse>();
            CreateMap<UpdateProfileRequest, ApplicationUser>();
        }
    }
}