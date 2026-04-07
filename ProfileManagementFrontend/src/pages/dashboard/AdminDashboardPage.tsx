import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { getAdminStats } from "@/api/adminApi";
import { useNavigate } from "react-router-dom";
import type { RecentUser, SkillFrequency } from "@/types/admin";
import {
  HiUsers, HiAcademicCap, HiBriefcase,
  HiCode, HiLink, HiArrowRight,
} from "react-icons/hi";

export default function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: getAdminStats,
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (isLoading) return (
    <div style={{ minHeight: "100vh", background: "#FAF9F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
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

  return (
    <div style={{ minHeight: "100vh", background: "#FAF9F7", padding: "40px 32px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 11, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>
            {greeting}
          </p>
          <h1 style={{ fontSize: 48, color: "#1A1814", lineHeight: 1.05, fontWeight: 400, fontFamily: "'Cormorant Garamond', serif" }}>
            {user?.firstName} {user?.lastName}
          </h1>
          <div style={{ width: 40, height: 1.5, background: "#1A1814", marginTop: 14 }} />
        </div>

        {/* User Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>

          {/* Total Users */}
          <div style={{
            background: "#1A1814", borderRadius: 20, padding: "24px 28px",
            boxShadow: "0 2px 8px rgba(26,24,20,0.12)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 10, color: "#A89880", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>
                Total Users
              </p>
              <HiUsers style={{ width: 16, height: 16, color: "#C4A882" }} />
            </div>
            <p style={{ fontSize: 40, fontWeight: 600, color: "#FAF9F7", lineHeight: 1 }}>
              {stats?.totalUsers ?? 0}
            </p>
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              <div>
                <p style={{ fontSize: 18, fontWeight: 500, color: "#C4A882" }}>{stats?.activeUsers ?? 0}</p>
                <p style={{ fontSize: 10, color: "#6B6058", textTransform: "uppercase", letterSpacing: "0.08em" }}>Active</p>
              </div>
              <div style={{ width: 1, background: "#2D2926" }} />
              <div>
                <p style={{ fontSize: 18, fontWeight: 500, color: "#8C8278" }}>{stats?.inactiveUsers ?? 0}</p>
                <p style={{ fontSize: 10, color: "#6B6058", textTransform: "uppercase", letterSpacing: "0.08em" }}>Inactive</p>
              </div>
            </div>
          </div>

          {/* Platform Content */}
          <div style={{
            background: "white", borderRadius: 20, padding: "24px 28px",
            border: "1px solid #F0EDE8", boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
          }}>
            <p style={{ fontSize: 10, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 16 }}>
              Platform Content
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Education Records", value: stats?.totalEducationRecords ?? 0, icon: HiAcademicCap },
                { label: "Work Experiences", value: stats?.totalWorkExperienceRecords ?? 0, icon: HiBriefcase },
                { label: "Projects", value: stats?.totalProjects ?? 0, icon: HiCode },
                { label: "Social Links", value: stats?.totalSocialLinks ?? 0, icon: HiLink },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon style={{ width: 13, height: 13, color: "#C4A882" }} />
                      <p style={{ fontSize: 12, color: "#8C8278" }}>{item.label}</p>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1814" }}>{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Skills */}
          <div style={{
            background: "white", borderRadius: 20, padding: "24px 28px",
            border: "1px solid #F0EDE8", boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
          }}>
            <p style={{ fontSize: 10, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 16 }}>
              Top Skills
            </p>
            {(stats?.topSkills?.length ?? 0) === 0 ? (
              <p style={{ fontSize: 13, color: "#B8B0A8" }}>No skills yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {stats?.topSkills.map((skill: SkillFrequency, i) => {
                  const maxCount = stats.topSkills[0]?.count ?? 1;
                  const width = `${Math.round((skill.count / maxCount) * 100)}%`;
                  return (
                    <div key={skill.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: "#1A1814" }}>
                          {i + 1}. {skill.name}
                        </span>
                        <span style={{ fontSize: 11, color: "#C4A882" }}>{skill.count}</span>
                      </div>
                      <div style={{ background: "#F0EDE8", borderRadius: 100, height: 3, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 100,
                          background: "linear-gradient(90deg, #C4A882, #A8895E)",
                          width,
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

          {/* Recent Users */}
          <div style={{
            background: "white", borderRadius: 20, padding: "24px 28px",
            border: "1px solid #F0EDE8", boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <p style={{ fontSize: 10, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>
                Recent Users
              </p>
              <button
                onClick={() => navigate("/admin")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 11, color: "#C4A882", background: "none",
                  border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}
              >
                View all <HiArrowRight style={{ width: 11, height: 11 }} />
              </button>
            </div>
            {(stats?.recentUsers?.length ?? 0) === 0 ? (
              <p style={{ fontSize: 13, color: "#B8B0A8" }}>No users yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {stats?.recentUsers.map((u: RecentUser) => (
                  <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, #1A1814, #3D2E1E)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#E8D5B7", fontSize: 11, fontWeight: 600,
                    }}>
                      {u.firstName?.[0]}{u.lastName?.[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "#1A1814" }}>
                        {u.firstName} {u.lastName}
                      </p>
                      <p style={{ fontSize: 11, color: "#B8B0A8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {u.email}
                      </p>
                    </div>
                    <p style={{ fontSize: 11, color: "#C4B8AC", flexShrink: 0 }}>
                      {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{
            background: "white", borderRadius: 20, padding: "24px 28px",
            border: "1px solid #F0EDE8", boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
          }}>
            <p style={{ fontSize: 10, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 16 }}>
              Quick Actions
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { label: "User Management", sub: "Search, filter and manage users", path: "/admin" },
                { label: "My Portfolio", sub: "View your own portfolio", path: "/portfolio/preview" },
                { label: "Profile Settings", sub: "Update your personal info", path: "/profile/settings" },
              ].map((action) => (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 14px", borderRadius: 12, cursor: "pointer",
                    background: "none", border: "none", width: "100%", textAlign: "left",
                    fontFamily: "'DM Sans', sans-serif", transition: "background 0.15s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F5F0EA")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#1A1814" }}>{action.label}</p>
                    <p style={{ fontSize: 11, color: "#B8B0A8" }}>{action.sub}</p>
                  </div>
                  <HiArrowRight style={{ width: 14, height: 14, color: "#D4CBC2", flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}