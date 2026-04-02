import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PublicNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <span
          onClick={() => navigate("/")}
          className="text-lg font-bold text-gray-900 cursor-pointer tracking-tight"
        >
          ProfileManager
        </span>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button size="sm" onClick={() => navigate("/register")}>
            Register
          </Button>
        </div>
      </div>
    </nav>
  );
}