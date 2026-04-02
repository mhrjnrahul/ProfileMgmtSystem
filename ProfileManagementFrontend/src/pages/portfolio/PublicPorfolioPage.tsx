import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPublicProfile } from "@/api/profileApi";
import { getPublicEducations } from "@/api/educationApi";
import { getPublicWorkExperiences } from "@/api/workExperienceApi";
import { getPublicSkills } from "@/api/skillApi";
import { getPublicProjects } from "@/api/projectApi";
import { getPublicSocialLinks } from "@/api/socialLinkApi";
import type { EducationResponse } from "@/types/education";

import type { SkillResponse } from "@/types/skill";
import type { ProjectResponse } from "@/types/project";
import type { SocialLinkResponse } from "@/types/socialLink";
import { HiLocationMarker, HiLink, HiArrowLeft } from "react-icons/hi";
import PublicNavbar from "@/components/layouts/PublicNavbar";
import { Button } from "@/components/ui/button";
import type { WorkExperienceResponse } from "@/types/workexperience";

const proficiencyLabel: Record<number, string> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
  4: "Expert",
};

const platformLabel: Record<number, string> = {
  1: "LinkedIn",
  2: "GitHub",
  3: "Twitter",
  4: "Website",
  5: "Other",
};

export default function PublicPortfolioPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["publicProfile", userId],
    queryFn: () => getPublicProfile(userId!),
  });

  const { data: educations } = useQuery({
    queryKey: ["publicEducations", userId],
    queryFn: () => getPublicEducations(userId!),
  });

  const { data: workExperiences } = useQuery({
    queryKey: ["publicWorkExperiences", userId],
    queryFn: () => getPublicWorkExperiences(userId!),
  });

  const { data: skills } = useQuery({
    queryKey: ["publicSkills", userId],
    queryFn: () => getPublicSkills(userId!),
  });

  const { data: projects } = useQuery({
    queryKey: ["publicProjects", userId],
    queryFn: () => getPublicProjects(userId!),
  });

  const { data: socialLinks } = useQuery({
    queryKey: ["publicSocialLinks", userId],
    queryFn: () => getPublicSocialLinks(userId!),
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#f8f8f6]">
        <PublicNavbar />
        <div className="flex items-center justify-center py-32">
          <p className="text-sm text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f8f8f6]">
        <PublicNavbar />
        <div className="flex items-center justify-center py-32">
          <p className="text-sm text-gray-400">Profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <PublicNavbar />

      <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">

        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-500 -ml-2"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {profile.firstName?.[0]}{profile.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-sm text-gray-400">{profile.email}</p>
              {(profile.city || profile.country) && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <HiLocationMarker className="w-3 h-3" />
                  {[profile.city, profile.country].filter(Boolean).join(", ")}
                </div>
              )}
              {profile.bio && (
                <p className="text-sm text-gray-600 mt-3">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Social Links */}
        {socialLinks?.length > 0 && (
          <Section title="Social Links">
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link: SocialLinkResponse) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors"
                >
                  <HiLink className="w-3 h-3" />
                  {platformLabel[link.platform]}
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: SkillResponse) => (
                <div key={skill.id} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5">
                  <span className="text-xs font-medium text-gray-700">{skill.name}</span>
                  <span className="text-xs text-gray-400">· {proficiencyLabel[skill.proficiencyLevel]}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Work Experience */}
        {workExperiences?.length > 0 && (
          <Section title="Work Experience">
            <div className="space-y-4">
              {workExperiences.map((work: WorkExperienceResponse) => (
                <div key={work.id} className="border-l-2 border-gray-200 pl-4">
                  <p className="text-sm font-semibold text-gray-900">{work.position}</p>
                  <p className="text-xs text-gray-500">{work.company}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(work.startDate).getFullYear()} —{" "}
                    {work.isCurrent ? "Present" : work.endDate ? new Date(work.endDate).getFullYear() : "Present"}
                  </p>
                  {work.description && (
                    <p className="text-xs text-gray-600 mt-1.5">{work.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Education */}
        {educations?.length > 0 && (
          <Section title="Education">
            <div className="space-y-4">
              {educations.map((edu: EducationResponse) => (
                <div key={edu.id} className="border-l-2 border-gray-200 pl-4">
                  <p className="text-sm font-semibold text-gray-900">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.degree} — {edu.fieldOfStudy}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(edu.startDate).getFullYear()} —{" "}
                    {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
                  </p>
                  {edu.description && (
                    <p className="text-xs text-gray-600 mt-1.5">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <Section title="Projects">
            <div className="space-y-4">
              {projects.map((project: ProjectResponse) => (
                <div key={project.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold text-gray-900">{project.title}</p>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                      >
                        <HiLink className="w-3 h-3" />
                        Link
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(project.startDate).getFullYear()} —{" "}
                    {project.endDate ? new Date(project.endDate).getFullYear() : "Present"}
                  </p>
                  {project.description && (
                    <p className="text-xs text-gray-600 mt-1.5">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">{title}</p>
      {children}
    </div>
  );
}