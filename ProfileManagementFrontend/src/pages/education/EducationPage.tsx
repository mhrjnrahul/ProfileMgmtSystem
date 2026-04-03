import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEducations, deleteEducation } from "../../api/educationApi";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { EducationResponse } from "../../types/education";
import CreateEducationDialog from "./components/CreateEducationDialog";
import EditEducationDialog from "./components/EditEducationDialog";
import { HiAcademicCap } from "react-icons/hi";

export default function EducationPage() {
  const queryClient = useQueryClient();

  const { data: educations, isLoading, error } = useQuery({
    queryKey: ["educations"],
    queryFn: getEducations,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["educations"] }),
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
      <p style={{ fontSize: 13, color: "#C4735A" }}>Failed to load education records.</p>
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
              Education
            </h1>
            <div style={{ width: 32, height: 1.5, background: "#1A1814", marginTop: 12 }} />
          </div>
          <CreateEducationDialog />
        </div>

        {/* Empty State */}
        {educations?.length === 0 && (
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
              <HiAcademicCap style={{ width: 22, height: 22, color: "#C4A882" }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1814", marginBottom: 6 }}>No education records yet</p>
            <p style={{ fontSize: 13, color: "#B8B0A8" }}>Add your educational background to strengthen your portfolio.</p>
          </div>
        )}

        {/* Records */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {educations?.map((education: EducationResponse) => (
            <div key={education.id} style={{
              background: "white", borderRadius: 20,
              border: "1px solid #F0EDE8",
              boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
              padding: "24px 28px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>

                {/* Left — dot + content */}
                <div style={{ display: "flex", gap: 16, flex: 1, minWidth: 0 }}>
                  <div style={{ paddingTop: 5, flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C4A882" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 500, color: "#1A1814", marginBottom: 3 }}>
                      {education.institution}
                    </p>
                    <p style={{ fontSize: 13, color: "#8C8278", marginBottom: 3 }}>
                      {education.degree} — {education.fieldOfStudy}
                    </p>
                    <p style={{ fontSize: 11, color: "#C4A882", fontWeight: 500 }}>
                      {new Date(education.startDate).getFullYear()} —{" "}
                      {education.endDate ? new Date(education.endDate).getFullYear() : "Present"}
                    </p>
                    {education.description && (
                      <p style={{ fontSize: 13, color: "#6B6058", lineHeight: 1.65, marginTop: 10 }}>
                        {education.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <EditEducationDialog education={education} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button style={{
                        fontSize: 12, color: "#C4735A", background: "#FEF2EE",
                        border: "1px solid #F5C4B5", borderRadius: 8,
                        padding: "6px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                        transition: "background 0.15s ease",
                      }}>
                        Delete
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete education record?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete {education.institution}. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(education.id)}>
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