import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { getEducations } from "../../api/educationApi";
import { getWorkExperiences } from "../../api/workExperienceApi";
import { getSkills } from "../../api/skillApi";
import { getProjects } from "../../api/projectApi";
import { getSocialLinks } from "../../api/socialLinkApi";
import { useNavigate } from "react-router-dom";
import {
  HiAcademicCap, HiBriefcase, HiLightningBolt,
  HiCode, HiLink, HiArrowRight,
} from "react-icons/hi";

const statConfig = [
  { label: "Education", tab: "education", icon: HiAcademicCap },
  { label: "Work Experience", tab: "workexperience", icon: HiBriefcase },
  { label: "Skills", tab: "skill", icon: HiLightningBolt },
  { label: "Projects", tab: "project", icon: HiCode },
  { label: "Social Links", tab: "sociallink", icon: HiLink },
];

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const { data: educations } = useQuery({ queryKey: ["educations"], queryFn: getEducations });
  const { data: workExperiences } = useQuery({ queryKey: ["workExperiences"], queryFn: getWorkExperiences });
  const { data: skills } = useQuery({ queryKey: ["skills"], queryFn: getSkills });
  const { data: projects } = useQuery({ queryKey: ["projects"], queryFn: getProjects });
  const { data: socialLinks } = useQuery({ queryKey: ["socialLinks"], queryFn: getSocialLinks });

  const counts = [
    educations?.length ?? 0,
    workExperiences?.length ?? 0,
    skills?.length ?? 0,
    projects?.length ?? 0,
    socialLinks?.length ?? 0,
  ];

  const sections = [educations, workExperiences, skills, projects, socialLinks];
  const completedSections = sections.filter(s => (s?.length ?? 0) > 0).length;
  const profileCompletion = Math.round((completedSections / 5) * 100);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ minHeight: "100vh", background: "#FAF9F7", padding: "48px 40px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .display { font-family: 'Cormorant Garamond', serif; }

        .stat-card {
          background: white;
          border: 1px solid #F0EDE8;
          border-radius: 18px;
          padding: 22px 20px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          box-shadow: 0 2px 8px rgba(26,24,20,0.04);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(26,24,20,0.10);
          border-color: #E8D5B7;
        }
        .stat-card:hover .stat-arrow { opacity: 1; transform: translateX(0); }
        .stat-arrow {
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          color: #C4A882;
        }

        .card {
          background: white;
          border: 1px solid #F0EDE8;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 2px 8px rgba(26,24,20,0.04);
        }

        .section-label {
          font-size: 10px;
          color: #C4B8AC;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 18px;
        }

        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 40, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, fontWeight: 500 }}>
              {greeting}
            </p>
            <h1 className="display" style={{ fontSize: 52, color: "#1A1814", lineHeight: 1, fontWeight: 400 }}>
              {user?.firstName} {user?.lastName}
            </h1>
            <div style={{ width: 40, height: 1.5, background: "#C4A882", marginTop: 14 }} />
          </div>

          {/* Profile completion pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "white", border: "1px solid #F0EDE8",
            borderRadius: 100, padding: "10px 18px",
            boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
          }}>
            <div style={{ position: "relative", width: 36, height: 36 }}>
              <svg width="36" height="36" viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="18" cy="18" r="15" fill="none" stroke="#F0EDE8" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke={profileCompletion >= 80 ? "#2D7A4F" : profileCompletion >= 50 ? "#C4A882" : "#C4735A"}
                  strokeWidth="3"
                  strokeDasharray={`${(profileCompletion / 100) * 94.2} 94.2`}
                  strokeLinecap="round"
                />
              </svg>
              <span style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: "#1A1814",
              }}>
                {profileCompletion}%
              </span>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#1A1814", lineHeight: 1 }}>
                {profileCompletion >= 80 ? "Strong profile" : profileCompletion >= 50 ? "Moderate profile" : "Needs work"}
              </p>
              <p style={{ fontSize: 11, color: "#B8B0A8", marginTop: 2 }}>
                {completedSections} of 5 sections
              </p>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div
          className="stats-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 16 }}
        >
          {statConfig.map((stat, i) => {
            const Icon = stat.icon;
            const isEmpty = counts[i] === 0;
            return (
              <div
                key={stat.label}
                className="stat-card"
                onClick={() => navigate('/portfolio/edit', { state: { tab: stat.tab } })}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: isEmpty ? "#F5F0EA" : "#1A1814",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon style={{ width: 15, height: 15, color: isEmpty ? "#C4A882" : "#E8D5B7" }} />
                  </div>
                  <HiArrowRight className="stat-arrow" style={{ width: 13, height: 13 }} />
                </div>
                <div>
                  <p style={{ fontSize: 30, fontWeight: 600, color: "#1A1814", lineHeight: 1, marginBottom: 5 }}>
                    {counts[i]}
                  </p>
                  <p style={{ fontSize: 11, color: "#A89880", lineHeight: 1.3 }}>{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom Row ── */}
        <div
          className="bottom-grid"
          style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}
        >

          {/* Portfolio Snapshot */}
          <div className="card">
            <p className="section-label">Portfolio Snapshot</p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #1A1814, #3D2E1E)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#E8D5B7", fontSize: 16, fontWeight: 600,
              }}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#1A1814" }}>
                  {user?.firstName} {user?.lastName}
                </p>
                <p style={{ fontSize: 12, color: "#B8B0A8", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Skills preview */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: "#C4B8AC", marginBottom: 8, fontWeight: 500 }}>Skills</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {skills?.slice(0, 4).map((skill) => (
                  <span key={skill.id} style={{
                    fontSize: 11, background: "#F5F0EA", color: "#8C7B6B",
                    padding: "4px 12px", borderRadius: 100, fontWeight: 500,
                  }}>
                    {skill.name}
                  </span>
                ))}
                {(skills?.length ?? 0) > 4 && (
                  <span style={{ fontSize: 11, color: "#B8B0A8", padding: "4px 0" }}>
                    +{(skills?.length ?? 0) - 4} more
                  </span>
                )}
                {(skills?.length ?? 0) === 0 && (
                  <span style={{ fontSize: 11, color: "#C4B8AC", fontStyle: "italic" }}>No skills added yet</span>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div style={{
              display: "flex", gap: 0,
              background: "#FAF9F7", borderRadius: 12,
              border: "1px solid #F0EDE8", overflow: "hidden",
            }}>
              {[
                { label: "Education", value: educations?.length ?? 0 },
                { label: "Experience", value: workExperiences?.length ?? 0 },
                { label: "Projects", value: projects?.length ?? 0 },
              ].map((item, i) => (
                <div key={item.label} style={{
                  flex: 1, padding: "12px 16px", textAlign: "center",
                  borderRight: i < 2 ? "1px solid #F0EDE8" : "none",
                }}>
                  <p style={{ fontSize: 18, fontWeight: 600, color: "#1A1814", lineHeight: 1 }}>{item.value}</p>
                  <p style={{ fontSize: 10, color: "#B8B0A8", marginTop: 3 }}>{item.label}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/portfolio/preview')}
              style={{
                marginTop: 16, width: "100%", padding: "10px",
                background: "none", border: "1px solid #F0EDE8",
                borderRadius: 10, cursor: "pointer", fontSize: 12,
                color: "#8C8278", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 6,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#C4A882";
                (e.currentTarget as HTMLButtonElement).style.color = "#1A1814";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#F0EDE8";
                (e.currentTarget as HTMLButtonElement).style.color = "#8C8278";
              }}
            >
              View my portfolio <HiArrowRight style={{ width: 12, height: 12 }} />
            </button>
          </div>

          {/* Account Info */}
          <div className="card" style={{ display: "flex", flexDirection: "column" }}>
            <p className="section-label">Account</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
              {[
                { label: "Email", value: user?.email },
                { label: "Role", value: user?.role },
                { label: "Status", value: "Active" },
              ].map((item, i) => (
                <div key={item.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 0",
                  borderBottom: i < 2 ? "1px solid #F5F0EA" : "none",
                }}>
                  <p style={{ fontSize: 12, color: "#B8B0A8" }}>{item.label}</p>
                  <p style={{
                    fontSize: 12, fontWeight: 500, color: "#1A1814",
                    maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    textAlign: "right",
                  }}>
                    {item.label === "Status" ? (
                      <span style={{
                        background: "#EDFAF3", color: "#2D7A4F",
                        padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 500,
                      }}>
                        Active
                      </span>
                    ) : item.value}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/profile/settings')}
              style={{
                marginTop: 20, width: "100%", padding: "10px",
                background: "#1A1814", border: "none",
                borderRadius: 10, cursor: "pointer", fontSize: 12,
                color: "white", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 6,
                transition: "background 0.15s ease",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#2D2926"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#1A1814"}
            >
              Edit profile settings <HiArrowRight style={{ width: 12, height: 12 }} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}