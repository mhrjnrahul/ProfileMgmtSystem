import { useParams, useNavigate } from "react-router-dom";
import PortfolioView from "./PortfolioView"; 
import PublicNavbar from "@/components/layouts/PublicNavbar";
import { Button } from "@/components/ui/button";
import { HiArrowLeft } from "react-icons/hi";

export default function PublicPortfolioPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <PublicNavbar />
      <div className="max-w-3xl mx-auto px-8 pt-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-500 -ml-2"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
      <PortfolioView userId={userId} />
    </div>
  );
}