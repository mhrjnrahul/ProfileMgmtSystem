import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EducationPage from "@/pages/education/EducationPage";
import WorkExperiencePage from "@/pages/workexperience/WorkExperiencePage";
import SkillPage from "@/pages/skill/SkillPage";
import ProjectPage from "@/pages/project/ProjectPage";
import SocialLinkPage from "@/pages/socialLink/SocialLinkPage";
import { useLocation } from "react-router-dom";

export default function EditPortfolioPage() {
  const location = useLocation();
   const defaultTab = location.state?.tab ?? 'education'
  return (
    <div className="min-h-screen bg-[#f8f8f6] p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Portfolio
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Edit Portfolio</h1>
          <div className="w-12 h-0.5 bg-gray-900 mt-3" />
        </div>

        <Tabs defaultValue={defaultTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="workexperience">Work Experience</TabsTrigger>
            <TabsTrigger value="skill">Skills</TabsTrigger>
            <TabsTrigger value="project">Projects</TabsTrigger>
            <TabsTrigger value="sociallink">Social Links</TabsTrigger>
          </TabsList>

          <TabsContent value="education">
            <EducationPage />
          </TabsContent>
          <TabsContent value="workexperience">
            <WorkExperiencePage />
          </TabsContent>
          <TabsContent value="skill">
            <SkillPage />
          </TabsContent>
          <TabsContent value="project">
            <ProjectPage />
          </TabsContent>
          <TabsContent value="sociallink">
            <SocialLinkPage />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}