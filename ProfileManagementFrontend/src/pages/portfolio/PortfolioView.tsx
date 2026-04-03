import { useQuery } from "@tanstack/react-query";
import { getPublicProfile } from "@/api/profileApi";
import { getPublicEducations } from "@/api/educationApi";
import { getPublicWorkExperiences } from "@/api/workExperienceApi";
import { getPublicSkills } from "@/api/skillApi";
import { getPublicProjects } from "@/api/projectApi";
import { getPublicSocialLinks } from "@/api/socialLinkApi";
import type { EducationResponse } from "@/types/education";
import type { WorkExperienceResponse } from "@/types/workexperience";
import type { SkillResponse } from "@/types/skill";
import type { ProjectResponse } from "@/types/project";
import type { SocialLinkResponse } from "@/types/socialLink";
import { HiLocationMarker, HiExternalLink } from "react-icons/hi";

const proficiencyLabel: Record<number, string> = {
  1: "Beginner", 2: "Intermediate", 3: "Advanced", 4: "Expert",
};
const proficiencyWidth: Record<number, string> = {
  1: "25%", 2: "50%", 3: "75%", 4: "100%",
};
const platformLabel: Record<number, string> = {
  1: "LinkedIn", 2: "GitHub", 3: "Twitter", 4: "Website", 5: "Other",
};
const platformColor: Record<number, string> = {
  1: "#0A66C2", 2: "#1A1814", 3: "#1DA1F2", 4: "#C4A882", 5: "#8C8278",
};

interface Props { userId: string; }

export default function PortfolioView({ userId }: Props) {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["publicProfile", userId],
    queryFn: () => getPublicProfile(userId),
  });
  const { data: educations } = useQuery({
    queryKey: ["publicEducations", userId],
    queryFn: () => getPublicEducations(userId),
  });
  const { data: workExperiences } = useQuery({
    queryKey: ["publicWorkExperiences", userId],
    queryFn: () => getPublicWorkExperiences(userId),
  });
  const { data: skills } = useQuery({
    queryKey: ["publicSkills", userId],
    queryFn: () => getPublicSkills(userId),
  });
  const { data: projects } = useQuery({
    queryKey: ["publicProjects", userId],
    queryFn: () => getPublicProjects(userId),
  });
  const { data: socialLinks } = useQuery({
    queryKey: ["publicSocialLinks", userId],
    queryFn: () => getPublicSocialLinks(userId),
  });

  if (isLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
      <div style={{ display: "inline-flex", gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%", background: "#C4A882",
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );

  if (!profile) return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <p style={{ fontSize: 14, color: "#B8B0A8" }}>Profile not found.</p>
    </div>
  );

  const hasWork = (workExperiences?.length ?? 0) > 0;
  const hasEdu = (educations?.length ?? 0) > 0;
  const hasSkills = (skills?.length ?? 0) > 0;
  const hasProjects = (projects?.length ?? 0) > 0;
  const hasSocial = (socialLinks?.length ?? 0) > 0;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .display { font-family: 'Cormorant Garamond', serif; }
        .bento-card {
          background: white;
          border: 1px solid #F0EDE8;
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(26,24,20,0.04);
          overflow: hidden;
        }
        .bento-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 14px;
        }
        .col-span-2 { grid-column: span 2; }
        .col-span-3 { grid-column: span 3; }
        .skill-bar {
          height: 3px;
          background: #F0EDE8;
          border-radius: 100px;
          margin-top: 8px;
          overflow: hidden;
        }
        .skill-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #C4A882, #A8895E);
          border-radius: 100px;
          transition: width 0.6s ease;
        }
        .project-card {
          background: #FAF9F7;
          border: 1px solid #F0EDE8;
          border-radius: 14px;
          padding: 18px 20px;
          transition: border-color 0.2s ease;
        }
        .project-card:hover { border-color: #C4A882; }
        .social-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 100px;
          border: 1px solid #F0EDE8;
          font-size: 13px;
          color: #6B6058;
          text-decoration: none;
          transition: all 0.2s ease;
          background: white;
          font-family: 'DM Sans', sans-serif;
        }
        .social-pill:hover {
          border-color: #C4A882;
          background: #FAF9F7;
          color: #1A1814;
          transform: translateY(-1px);
        }
        .section-label {
          font-size: 10px;
          color: #C4B8AC;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 16px;
        }
        .timeline-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #C4A882;
          flex-shrink: 0;
          margin-top: 5px;
        }
        @media (max-width: 768px) {
          .bento-grid { grid-template-columns: 1fr !important; }
          .col-span-2 { grid-column: span 1 !important; }
          .col-span-3 { grid-column: span 1 !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .bento-grid { grid-template-columns: 1fr 1fr; }
          .col-span-2 { grid-column: span 2; }
          .col-span-3 { grid-column: span 2; }
        }
      `}</style>

      <div className="bento-grid">

        {/* ── Row 1: Hero + Skills ── */}

        {/* Hero Card */}
        <div className={`bento-card ${hasSkills ? "col-span-2" : "col-span-3"}`}
          style={{ padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #1A1814 0%, #3D2E1E 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#E8D5B7", fontSize: 26, fontWeight: 600,
            }}>
              {profile.firstName?.[0]}{profile.lastName?.[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 className="display" style={{ fontSize: 32, fontWeight: 400, color: "#1A1814", lineHeight: 1.1, marginBottom: 4 }}>
                {profile.firstName} {profile.lastName}
              </h2>
              <p style={{ fontSize: 13, color: "#B8B0A8", marginBottom: 8 }}>{profile.email}</p>
              {(profile.city || profile.country) && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#F5F0EA", borderRadius: 100, padding: "4px 12px" }}>
                  <HiLocationMarker style={{ width: 11, height: 11, color: "#C4A882" }} />
                  <span style={{ fontSize: 12, color: "#8C7B6B" }}>
                    {[profile.city, profile.country].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
          {profile.bio && (
            <p style={{
              fontSize: 14, color: "#6B6058", lineHeight: 1.75,
              marginTop: 20, paddingTop: 20,
              borderTop: "1px solid #F0EDE8",
            }}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Skills Card */}
        {hasSkills && (
          <div className="bento-card" style={{ padding: "24px" }}>
            <p className="section-label">Skills</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {skills?.slice(0, 6).map((skill: SkillResponse) => (
                <div key={skill.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#1A1814" }}>{skill.name}</span>
                    <span style={{ fontSize: 11, color: "#C4A882" }}>{proficiencyLabel[skill.proficiencyLevel]}</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-bar-fill" style={{ width: proficiencyWidth[skill.proficiencyLevel] }} />
                  </div>
                </div>
              ))}
              {(skills?.length ?? 0) > 6 && (
                <p style={{ fontSize: 12, color: "#B8B0A8", marginTop: 4 }}>+{(skills?.length ?? 0) - 6} more</p>
              )}
            </div>
          </div>
        )}

        {/* ── Row 2: Work + Education ── */}

        {hasWork && (
          <div className={`bento-card ${!hasEdu ? "col-span-2" : ""}`} style={{ padding: "24px 28px" }}>
            <p className="section-label">Work Experience</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {workExperiences?.map((work: WorkExperienceResponse) => (
                <div key={work.id} style={{ display: "flex", gap: 14 }}>
                  <div className="timeline-dot" />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1814", lineHeight: 1.3 }}>{work.position}</p>
                    <p style={{ fontSize: 13, color: "#8C8278", marginTop: 2 }}>{work.company}</p>
                    <p style={{ fontSize: 11, color: "#C4A882", marginTop: 3, fontWeight: 500 }}>
                      {new Date(work.startDate).getFullYear()} —{" "}
                      {work.isCurrent ? "Present" : work.endDate ? new Date(work.endDate).getFullYear() : "Present"}
                    </p>
                    {work.description && (
                      <p style={{ fontSize: 12, color: "#6B6058", lineHeight: 1.6, marginTop: 6 }}>{work.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasEdu && (
          <div className={`bento-card ${!hasWork ? "col-span-2" : ""}`} style={{ padding: "24px 28px" }}>
            <p className="section-label">Education</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {educations?.map((edu: EducationResponse) => (
                <div key={edu.id} style={{ display: "flex", gap: 14 }}>
                  <div className="timeline-dot" />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1814", lineHeight: 1.3 }}>{edu.institution}</p>
                    <p style={{ fontSize: 13, color: "#8C8278", marginTop: 2 }}>{edu.degree} — {edu.fieldOfStudy}</p>
                    <p style={{ fontSize: 11, color: "#C4A882", marginTop: 3, fontWeight: 500 }}>
                      {new Date(edu.startDate).getFullYear()} —{" "}
                      {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
                    </p>
                    {edu.description && (
                      <p style={{ fontSize: 12, color: "#6B6058", lineHeight: 1.6, marginTop: 6 }}>{edu.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Row 3: Projects + Social ── */}

        {hasProjects && (
          <div className={`bento-card ${hasSocial ? "col-span-2" : "col-span-3"}`} style={{ padding: "24px 28px" }}>
            <p className="section-label">Projects</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {projects?.map((project: ProjectResponse) => (
                <div key={project.id} className="project-card">
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#1A1814", lineHeight: 1.3 }}>{project.title}</p>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer"
                        style={{ color: "#C4A882", flexShrink: 0 }}>
                        <HiExternalLink style={{ width: 14, height: 14 }} />
                      </a>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: "#C4A882", marginTop: 4, fontWeight: 500 }}>
                    {new Date(project.startDate).getFullYear()} —{" "}
                    {project.endDate ? new Date(project.endDate).getFullYear() : "Present"}
                  </p>
                  {project.description && (
                    <p style={{
                      fontSize: 12, color: "#6B6058", lineHeight: 1.6, marginTop: 6,
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {hasSocial && (
          <div className="bento-card" style={{ padding: "24px" }}>
            <p className="section-label">Connect</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {socialLinks?.map((link: SocialLinkResponse) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-pill"
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: platformColor[link.platform], flexShrink: 0,
                  }} />
                  {platformLabel[link.platform]}
                  <HiExternalLink style={{ width: 11, height: 11, marginLeft: "auto", color: "#C4A882" }} />
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "white", borderRadius: 20,
      border: "1px solid #F0EDE8",
      boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
      padding: "24px 28px",
    }}>
      <p style={{ fontSize: 10, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>
        {title}
      </p>
      {children}
    </div>
  );
}