import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAllProfiles } from "@/api/profileApi";
import type { ProfileResponse } from "@/types/profile";
import { HiLocationMarker, HiArrowRight } from "react-icons/hi";
import PublicNavbar from "@/components/layouts/PublicNavbar";

export default function HomePage() {
  const navigate = useNavigate();

  const { data: users, isLoading } = useQuery({
    queryKey: ["allProfiles"],
    queryFn: getAllProfiles,
  });

  return (
    <div style={{ minHeight: "100vh", background: "#FAF9F7", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .display { font-family: 'Cormorant Garamond', serif; }
        .profile-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #F0EDE8;
          padding: 24px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          box-shadow: 0 2px 8px rgba(26,24,20,0.04);
        }
        .profile-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(26,24,20,0.10);
          border-color: #E8D5B7;
        }
        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1A1814, #3D2E1E);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E8D5B7;
          font-size: 15px;
          font-weight: 600;
          flex-shrink: 0;
        }
        .tag {
          background: #F5F0EA;
          color: #8C7B6B;
          border-radius: 100px;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 500;
        }
        .hero-btn-primary {
          background: #1A1814;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 13px 28px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
        }
        .hero-btn-primary:hover { background: #2D2926; transform: translateY(-1px); }
        .hero-btn-secondary {
          background: transparent;
          color: #6B6058;
          border: 1.5px solid #E8E0D8;
          border-radius: 12px;
          padding: 12px 28px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .hero-btn-secondary:hover { border-color: #C4A882; color: #1A1814; }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .s1 { animation-delay: 0.1s; opacity: 0; }
        .s2 { animation-delay: 0.2s; opacity: 0; }
        .s3 { animation-delay: 0.3s; opacity: 0; }
        .s4 { animation-delay: 0.4s; opacity: 0; }
        .divider { width: 1px; height: 40px; background: #E8E0D8; }
        .stat-num { font-size: 28px; font-weight: 600; color: #1A1814; line-height: 1; }
        .stat-label { font-size: 11px; color: #A89880; margin-top: 4px; letter-spacing: 0.05em; text-transform: uppercase; }
      `}</style>

      <PublicNavbar />

      {/* Hero */}
      <div style={{ borderBottom: "1px solid #F0EDE8", background: "white" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px 72px" }}>

          {/* Eyebrow */}
          <div className="fade-up s1" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#F5F0EA", borderRadius: 100, padding: "6px 14px", marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C4A882" }} />
            <span style={{ fontSize: 12, color: "#8C7B6B", fontWeight: 500, letterSpacing: "0.04em" }}>
              Professional Portfolio Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="display fade-up s2" style={{ fontSize: "clamp(48px, 7vw, 80px)", lineHeight: 1.05, color: "#1A1814", fontWeight: 400, marginBottom: 24, maxWidth: 700 }}>
            Discover the people<br />
            behind the <em style={{ color: "#C4A882" }}>work</em>
          </h1>

          {/* Subtext */}
          <p className="fade-up s3" style={{ fontSize: 16, color: "#8C8278", lineHeight: 1.7, maxWidth: 480, marginBottom: 36 }}>
            Browse portfolios from professionals across every field. Find talent, get inspired, and connect with people doing remarkable things.
          </p>

          {/* CTA Buttons */}
          <div className="fade-up s4" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <button className="hero-btn-primary" onClick={() => navigate("/register")}>
              Create your portfolio
              <HiArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button className="hero-btn-secondary" onClick={() => navigate("/login")}>
              Sign in
            </button>
          </div>

          {/* Stats */}
          <div className="fade-up s4" style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 56, paddingTop: 40, borderTop: "1px solid #F0EDE8" }}>
            <div>
              <div className="stat-num">{users?.length ?? "—"}</div>
              <div className="stat-label">Professionals</div>
            </div>
            <div className="divider" />
            <div>
              <div className="stat-num">5</div>
              <div className="stat-label">Portfolio sections</div>
            </div>
            <div className="divider" />
            <div>
              <div className="stat-num">Free</div>
              <div className="stat-label">Always</div>
            </div>
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 32px 80px" }}>

        {/* Section Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: 11, color: "#A89880", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
              Community
            </p>
            <h2 className="display" style={{ fontSize: 32, color: "#1A1814", fontWeight: 400 }}>
              Browse profiles
            </h2>
          </div>
          <p style={{ fontSize: 13, color: "#B8B0A8" }}>
            {users?.length ?? 0} {users?.length === 1 ? "profile" : "profiles"}
          </p>
        </div>

        {isLoading && (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <div style={{ display: "inline-flex", gap: 6 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#C4A882",
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
                }} />
              ))}
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }`}</style>
          </div>
        )}

        {!isLoading && (users?.length ?? 0) === 0 && (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <p style={{ fontSize: 14, color: "#B8B0A8" }}>No profiles yet. Be the first!</p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {users?.map((user: ProfileResponse) => (
            <div
              key={user.id}
              className="profile-card"
              onClick={() => navigate(`/portfolio/${user.id}`)}
            >
              {/* Card Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div className="avatar">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1814", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.firstName} {user.lastName}
                  </p>
                  <p style={{ fontSize: 12, color: "#B8B0A8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <p style={{ fontSize: 13, color: "#6B6058", lineHeight: 1.6, marginBottom: 14,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {user.bio}
                </p>
              )}

              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: user.bio ? 0 : 8 }}>
                {(user.city || user.country) ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <HiLocationMarker style={{ width: 12, height: 12, color: "#C4A882" }} />
                    <span style={{ fontSize: 12, color: "#A89880" }}>
                      {[user.city, user.country].filter(Boolean).join(", ")}
                    </span>
                  </div>
                ) : <div />}

                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#C4A882" }}>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>View</span>
                  <HiArrowRight style={{ width: 12, height: 12 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}