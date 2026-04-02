import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { getEducations } from "../../api/educationApi";
import { getWorkExperiences } from "../../api/workExperienceApi";
import { getSkills } from "../../api/skillApi";
import { getProjects } from "../../api/projectApi";
import { getSocialLinks } from "../../api/socialLinkApi";
import { useNavigate } from "react-router-dom";
import {
  HiAcademicCap,
  HiBriefcase,
  HiLightningBolt,
  HiCode,
  HiLink,
  HiArrowRight,
  HiPencil,
  HiCollection,
} from "react-icons/hi";

const statConfig = [
  { label: "Education", path: "/education", icon: HiAcademicCap, color: "from-slate-800 to-slate-700" },
  { label: "Work Experience", path: "/workexperience", icon: HiBriefcase, color: "from-zinc-800 to-zinc-700" },
  { label: "Skills", path: "/skill", icon: HiLightningBolt, color: "from-stone-800 to-stone-700" },
  { label: "Projects", path: "/project", icon: HiCode, color: "from-neutral-800 to-neutral-700" },
  { label: "Social Links", path: "/sociallink", icon: HiLink, color: "from-gray-800 to-gray-700" },
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
    <div className="min-h-screen bg-[#f8f8f6] p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        .dashboard-root { font-family: 'DM Sans', sans-serif; }
        .display-font { font-family: 'DM Serif Display', serif; }
        .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
        .action-card { transition: all 0.2s ease; }
        .action-card:hover { transform: translateX(4px); }
      `}</style>

      <div className="dashboard-root max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-medium text-gray-400 tracking-widest uppercase mb-2">
            {greeting}
          </p>
          <h1 className="display-font text-5xl text-gray-900 leading-tight">
            {user?.firstName} {user?.lastName}
          </h1>
          <div className="w-16 h-0.5 bg-gray-900 mt-4" />
        </div>

        {/* Profile Completion */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-gray-400">
                Profile Strength
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-0.5">
                {profileCompletion}%
              </p>
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
              profileCompletion >= 80
                ? "bg-emerald-50 text-emerald-700"
                : profileCompletion >= 50
                ? "bg-amber-50 text-amber-700"
                : "bg-red-50 text-red-600"
            }`}>
              {profileCompletion >= 80 ? "Strong" : profileCompletion >= 50 ? "Moderate" : "Needs Work"}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-gray-900 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {completedSections} of 5 sections completed
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {statConfig.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                onClick={() => navigate(stat.path)}
                className={`stat-card cursor-pointer bg-linear-to-br ${stat.color} rounded-2xl p-5 text-white shadow-sm`}
              >
                <Icon className="w-5 h-5 mb-4 opacity-60" />
                <p className="text-3xl font-semibold mb-1">{counts[i]}</p>
                <p className="text-xs font-medium opacity-60 leading-tight">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-5">
              Quick Actions
            </p>
            <div className="space-y-2">
              {[
                { label: "Edit Profile Settings", sub: "Update your personal info", path: "/profile/settings", icon: HiPencil },
                { label: "Edit Portfolio", sub: "Manage all your sections", path: "/portfolio/edit", icon: HiCollection },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.path}
                    onClick={() => navigate(action.path)}
                    className="action-card w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <Icon className="w-4 h-4 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{action.label}</p>
                        <p className="text-xs text-gray-400">{action.sub}</p>
                      </div>
                    </div>
                    <HiArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">

            {/* Portfolio Preview */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">
                Portfolio Preview
              </p>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {skills?.slice(0, 3).map((skill) => (
                    <span key={skill.id} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                      {skill.name}
                    </span>
                  ))}
                  {(skills?.length ?? 0) > 3 && (
                    <span className="text-xs text-gray-400">+{(skills?.length ?? 0) - 3} more</span>
                  )}
                  {(skills?.length ?? 0) === 0 && (
                    <span className="text-xs text-gray-400 italic">No skills added yet</span>
                  )}
                </div>
                <div className="flex gap-3 text-xs text-gray-400">
                  <span>{educations?.length ?? 0} education</span>
                  <span>·</span>
                  <span>{workExperiences?.length ?? 0} experience</span>
                  <span>·</span>
                  <span>{projects?.length ?? 0} projects</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/portfolio/edit')}
                className="w-full mt-3 text-xs font-medium text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1 transition-colors"
              >
                View full portfolio <HiArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">
                Account Info
              </p>
              <div className="space-y-3">
                {[
                  { label: "Email", value: user?.email },
                  { label: "Role", value: user?.role },
                  { label: "Status", value: "Active" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center">
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-xs font-medium text-gray-900">{item.value}</p>
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