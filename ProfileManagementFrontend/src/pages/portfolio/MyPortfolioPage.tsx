import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/api/profileApi";
import PortfolioView from "./PortfolioView";

export default function MyPortfolioPage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
  });

  if (isLoading) return (
    <div style={{ minHeight: "100vh", background: "#FAF9F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: 14, color: "#B8B0A8" }}>Loading...</p>
    </div>
  );

  if (!profile) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#FAF9F7", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 32px 24px" }}>
        <p style={{ fontSize: 10, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>
          Preview
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 400, color: "#1A1814", lineHeight: 1.2, fontFamily: "'Cormorant Garamond', serif" }}>
          My Portfolio
        </h1>
        <p style={{ fontSize: 13, color: "#A89880", marginTop: 6 }}>
          This is how your portfolio appears to others.
        </p>
        <div style={{ width: 40, height: 1.5, background: "#1A1814", marginTop: 16 }} />
      </div>

      <PortfolioView userId={profile.id} />
    </div>
  );
}