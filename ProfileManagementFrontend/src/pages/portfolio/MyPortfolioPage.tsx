import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/api/profileApi";
import PortfolioView from "./PortfolioView";

export default function MyPortfolioPage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
  });

  if (isLoading) return (
    <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center">
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <div className="max-w-3xl mx-auto px-8 pt-8">
        <div className="mb-6">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Preview
          </p>
          <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
          <p className="text-xs text-gray-400 mt-1">
            This is how your portfolio appears to others.
          </p>
          <div className="w-12 h-0.5 bg-gray-900 mt-3" />
        </div>
      </div>
      <PortfolioView userId={profile.id} />
    </div>
  );
}