import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkExperiences, deleteWorkExperience } from "../../api/workExperienceApi";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { WorkExperienceResponse } from "@/types/workexperience";
import CreateWorkExperienceDialog from "./components/CreateWorkExperienceDialog";
import EditWorkExperienceDialog from "./components/EditWorkExperienceDialog";
import { HiBriefcase } from "react-icons/hi";

export default function WorkExperiencePage() {
  const queryClient = useQueryClient();

  const { data: workExperiences, isLoading, error } = useQuery({
    queryKey: ["workExperiences"],
    queryFn: getWorkExperiences,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWorkExperience,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workExperiences"] }),
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
      <p style={{ fontSize: 13, color: "#C4735A" }}>Failed to load work experience records.</p>
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
              Work Experience
            </h1>
            <div style={{ width: 32, height: 1.5, background: "#1A1814", marginTop: 12 }} />
          </div>
          <CreateWorkExperienceDialog />
        </div>

        {/* Empty State */}
        {workExperiences?.length === 0 && (
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
              <HiBriefcase style={{ width: 22, height: 22, color: "#C4A882" }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1814", marginBottom: 6 }}>No work experience yet</p>
            <p style={{ fontSize: 13, color: "#B8B0A8" }}>Add your work history to strengthen your portfolio.</p>
          </div>
        )}

        {/* Records */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {workExperiences?.map((work: WorkExperienceResponse) => (
            <div key={work.id} style={{
              background: "white", borderRadius: 20,
              border: "1px solid #F0EDE8",
              boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
              padding: "24px 28px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>

                <div style={{ display: "flex", gap: 16, flex: 1, minWidth: 0 }}>
                  <div style={{ paddingTop: 5, flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C4A882" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <p style={{ fontSize: 15, fontWeight: 500, color: "#1A1814" }}>{work.position}</p>
                      {work.isCurrent && (
                        <span style={{
                          fontSize: 10, fontWeight: 500, color: "#2D7A4F",
                          background: "#EDFAF3", borderRadius: 100, padding: "2px 8px",
                        }}>
                          Current
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: "#8C8278", marginBottom: 3 }}>{work.company}</p>
                    <p style={{ fontSize: 11, color: "#C4A882", fontWeight: 500 }}>
                      {new Date(work.startDate).getFullYear()} —{" "}
                      {work.isCurrent ? "Present" : work.endDate ? new Date(work.endDate).getFullYear() : "Present"}
                    </p>
                    {work.description && (
                      <p style={{ fontSize: 13, color: "#6B6058", lineHeight: 1.65, marginTop: 10 }}>
                        {work.description}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <EditWorkExperienceDialog workexperience={work} />
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
                        <AlertDialogTitle>Delete work experience?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete {work.position} at {work.company}. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(work.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}