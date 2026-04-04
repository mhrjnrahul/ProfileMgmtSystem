import { deleteSkill, getSkills } from "@/api/skillApi";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { SkillResponse } from "@/types/skill";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import EditSkillDialog from "./components/EditSkillDialog";
import CreateSkillDialog from "./components/CreateSkillDialog";
import { HiLightningBolt } from "react-icons/hi";

const proficiencyLabel: Record<number, string> = {
  1: "Beginner", 2: "Intermediate", 3: "Advanced", 4: "Expert",
};
const proficiencyWidth: Record<number, string> = {
  1: "25%", 2: "50%", 3: "75%", 4: "100%",
};

export default function SkillPage() {
  const queryClient = useQueryClient();

  const { data: skills, isLoading, error } = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["skills"] }),
  });

  if (isLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
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

  if (error) return (
    <div style={{ padding: "40px 32px" }}>
      <p style={{ fontSize: 13, color: "#C4735A" }}>Failed to load skills.</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#FAF9F7", padding: "40px 32px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: 10, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 8 }}>
              Portfolio
            </p>
            <h1 style={{ fontSize: 36, fontWeight: 400, color: "#1A1814", lineHeight: 1.1, fontFamily: "'Cormorant Garamond', serif" }}>
              Skills
            </h1>
            <div style={{ width: 32, height: 1.5, background: "#1A1814", marginTop: 12 }} />
          </div>
          <CreateSkillDialog />
        </div>

        {/* Empty State */}
        {skills?.length === 0 && (
          <div style={{
            background: "white", borderRadius: 20, border: "1px solid #F0EDE8",
            boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
            padding: "64px 32px", textAlign: "center",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: "#F5F0EA",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <HiLightningBolt style={{ width: 22, height: 22, color: "#C4A882" }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1814", marginBottom: 6 }}>No skills yet</p>
            <p style={{ fontSize: 13, color: "#B8B0A8" }}>Add your skills to showcase your expertise.</p>
          </div>
        )}

        {/* Skills Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {skills?.map((skill: SkillResponse) => (
            <div key={skill.id} style={{
              background: "white", borderRadius: 20,
              border: "1px solid #F0EDE8",
              boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
              padding: "20px 24px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1814" }}>{skill.name}</p>
                <span style={{ fontSize: 11, color: "#C4A882", fontWeight: 500, flexShrink: 0 }}>
                  {proficiencyLabel[skill.proficiencyLevel]}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ background: "#F0EDE8", borderRadius: 100, height: 3, marginBottom: 16, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 100,
                  background: "linear-gradient(90deg, #C4A882, #A8895E)",
                  width: proficiencyWidth[skill.proficiencyLevel],
                }} />
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <EditSkillDialog skill={skill} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button style={{
                      fontSize: 12, color: "#C4735A", background: "#FEF2EE",
                      border: "1px solid #F5C4B5", borderRadius: 8,
                      padding: "6px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    }}>
                      Delete
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete skill?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {skill.name}. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(skill.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}