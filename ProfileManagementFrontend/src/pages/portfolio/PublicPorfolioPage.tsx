import { useParams, useNavigate } from "react-router-dom";
import PublicNavbar from "@/components/layouts/PublicNavbar";
import PortfolioView from "./PortfolioView";
import { HiArrowLeft } from "react-icons/hi";

export default function PublicPortfolioPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#FAF9F7", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <PublicNavbar />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 32px 0" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "#A89880", background: "none", border: "none",
            cursor: "pointer", padding: "6px 0", transition: "color 0.15s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#1A1814")}
          onMouseLeave={e => (e.currentTarget.style.color = "#A89880")}
        >
          <HiArrowLeft style={{ width: 14, height: 14 }} />
          Back
        </button>
      </div>

      <PortfolioView userId={userId!} />
    </div>
  );
}