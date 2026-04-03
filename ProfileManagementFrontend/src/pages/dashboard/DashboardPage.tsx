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
  HiCode, HiLink, HiArrowRight, HiPencil, HiCollection,
} from "react-icons/hi";

const statConfig = [
  { label: "Education", path: "/education", icon: HiAcademicCap },
  { label: "Work Experience", path: "/workexperience", icon: HiBriefcase },
  { label: "Skills", path: "/skill", icon: HiLightningBolt },
  { label: "Projects", path: "/project", icon: HiCode },
  { label: "Social Links", path: "/sociallink", icon: HiLink },
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
    <div style={{ minHeight: "100vh", background: "#FAF9F7", padding: "40px 32px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .display { font-family: 'Cormorant Garamond', serif; }
        .stat-card {
          background: white;
          border: 1px solid #F0EDE8;
          border-radius: 18px;
          padding: 20px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          box-shadow: 0 2px 8px rgba(26,24,20,0.04);
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(26,24,20,0.10);
          border-color: #E8D5B7;
        }
        .action-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.15s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: 'DM Sans', sans-serif;
        }
        .action-row:hover { background: #F5F0EA; }
        .action-row:hover .action-arrow { color: #1A1814; }
        .action-arrow { color: #D4CBC2; transition: color 0.15s ease; }
      `}</style>

      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 11, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>
            {greeting}
          </p>
          <h1 className="display" style={{ fontSize: 48, color: "#1A1814", lineHeight: 1.05, fontWeight: 400 }}>
            {user?.firstName} {user?.lastName}
          </h1>
          <div style={{ width: 40, height: 1.5, background: "#1A1814", marginTop: 14 }} />
        </div>

        {/* Profile Strength */}
        <div style={{
          background: "white", borderRadius: 20, padding: "24px 28px",
          border: "1px solid #F0EDE8", boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
          marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 10, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 6 }}>
                Profile Strength
              </p>
              <p style={{ fontSize: 28, fontWeight: 600, color: "#1A1814", lineHeight: 1 }}>
                {profileCompletion}%
              </p>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 500, padding: "5px 14px", borderRadius: 100,
              background: profileCompletion >= 80 ? "#EDFAF3" : profileCompletion >= 50 ? "#FBF6EF" : "#FEF2EE",
              color: profileCompletion >= 80 ? "#2D7A4F" : profileCompletion >= 50 ? "#A8895E" : "#C4735A",
            }}>
              {profileCompletion >= 80 ? "Strong" : profileCompletion >= 50 ? "Moderate" : "Needs Work"}
            </span>
          </div>
          <div style={{ background: "#F0EDE8", borderRadius: 100, height: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 100,
              background: "linear-gradient(90deg, #C4A882, #A8895E)",
              width: `${profileCompletion}%`,
              transition: "width 0.7s ease",
            }} />
          </div>
          <p style={{ fontSize: 12, color: "#B8B0A8", marginTop: 8 }}>
            {completedSections} of 5 sections completed
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
          {statConfig.map((stat, i) => {
            const Icon = stat.icon;
            const isEmpty = counts[i] === 0;
            return (
              <div key={stat.label} className="stat-card" onClick={() => navigate(stat.path)}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, marginBottom: 16,
                  background: isEmpty ? "#F5F0EA" : "#1A1814",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon style={{ width: 16, height: 16, color: isEmpty ? "#C4A882" : "#E8D5B7" }} />
                </div>
                <p style={{ fontSize: 28, fontWeight: 600, color: "#1A1814", lineHeight: 1, marginBottom: 4 }}>
                  {counts[i]}
                </p>
                <p style={{ fontSize: 11, color: "#A89880", lineHeight: 1.3 }}>{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

          {/* Quick Actions */}
          <div style={{
            background: "white", borderRadius: 20, padding: "24px",
            border: "1px solid #F0EDE8", boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
          }}>
            <p style={{ fontSize: 10, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 16 }}>
              Quick Actions
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { label: "Edit Profile Settings", sub: "Update your personal info", path: "/profile/settings", icon: HiPencil },
                { label: "Edit Portfolio", sub: "Manage all your sections", path: "/portfolio/edit", icon: HiCollection },
                { label: "View My Portfolio", sub: "See how others see you", path: "/portfolio/preview", icon: HiArrowRight },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button key={action.path} className="action-row" onClick={() => navigate(action.path)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10,
                        background: "#F5F0EA",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon style={{ width: 15, height: 15, color: "#8C7B6B" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "#1A1814" }}>{action.label}</p>
                        <p style={{ fontSize: 11, color: "#B8B0A8" }}>{action.sub}</p>
                      </div>
                    </div>
                    <HiArrowRight className="action-arrow" style={{ width: 14, height: 14 }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Portfolio Snapshot */}
            <div style={{
              background: "white", borderRadius: 20, padding: "24px",
              border: "1px solid #F0EDE8", boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
              flex: 1,
            }}>
              <p style={{ fontSize: 10, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 16 }}>
                Portfolio Snapshot
              </p>
              <div style={{ background: "#FAF9F7", borderRadius: 14, padding: "16px", border: "1px solid #F0EDE8" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%",
                    background: "linear-gradient(135deg, #1A1814, #3D2E1E)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#E8D5B7", fontSize: 12, fontWeight: 600, flexShrink: 0,
                  }}>
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#1A1814" }}>
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p style={{ fontSize: 11, color: "#B8B0A8" }}>{user?.email}</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  {skills?.slice(0, 3).map((skill) => (
                    <span key={skill.id} style={{
                      fontSize: 11, background: "#F5F0EA", color: "#8C7B6B",
                      padding: "3px 10px", borderRadius: 100,
                    }}>
                      {skill.name}
                    </span>
                  ))}
                  {(skills?.length ?? 0) > 3 && (
                    <span style={{ fontSize: 11, color: "#B8B0A8" }}>+{(skills?.length ?? 0) - 3} more</span>
                  )}
                  {(skills?.length ?? 0) === 0 && (
                    <span style={{ fontSize: 11, color: "#C4B8AC", fontStyle: "italic" }}>No skills added yet</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#B8B0A8" }}>
                  <span>{educations?.length ?? 0} education</span>
                  <span>·</span>
                  <span>{workExperiences?.length ?? 0} experience</span>
                  <span>·</span>
                  <span>{projects?.length ?? 0} projects</span>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div style={{
              background: "white", borderRadius: 20, padding: "24px",
              border: "1px solid #F0EDE8", boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
            }}>
              <p style={{ fontSize: 10, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 16 }}>
                Account
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Email", value: user?.email },
                  { label: "Role", value: user?.role },
                  { label: "Status", value: "Active" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: 12, color: "#B8B0A8" }}>{item.label}</p>
                    <p style={{ fontSize: 12, fontWeight: 500, color: "#1A1814" }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}