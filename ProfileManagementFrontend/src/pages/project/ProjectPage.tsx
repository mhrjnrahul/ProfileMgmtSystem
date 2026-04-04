import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, deleteProject } from "../../api/projectApi";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { ProjectResponse } from "../../types/project";
import CreateProjectDialog from "./components/CreateProjectDialog";
import EditProjectDialog from "./components/EditProjectDialog";
import { HiCode, HiExternalLink } from "react-icons/hi";

export default function ProjectPage() {
  const queryClient = useQueryClient();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
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
      <p style={{ fontSize: 13, color: "#C4735A" }}>Failed to load projects.</p>
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
              Projects
            </h1>
            <div style={{ width: 32, height: 1.5, background: "#1A1814", marginTop: 12 }} />
          </div>
          <CreateProjectDialog />
        </div>

        {/* Empty State */}
        {projects?.length === 0 && (
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
              <HiCode style={{ width: 22, height: 22, color: "#C4A882" }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1814", marginBottom: 6 }}>No projects yet</p>
            <p style={{ fontSize: 13, color: "#B8B0A8" }}>Add your projects to showcase your work.</p>
          </div>
        )}

        {/* Projects Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {projects?.map((project: ProjectResponse) => (
            <div key={project.id} style={{
              background: "white", borderRadius: 20,
              border: "1px solid #F0EDE8",
              boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
              padding: "22px 24px",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              {/* Title + URL */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1814", lineHeight: 1.3 }}>{project.title}</p>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#C4A882", flexShrink: 0 }}
                  >
                    <HiExternalLink style={{ width: 15, height: 15 }} />
                  </a>
                )}
              </div>

              {/* Date */}
              <p style={{ fontSize: 11, color: "#C4A882", fontWeight: 500 }}>
                {new Date(project.startDate).getFullYear()} —{" "}
                {project.endDate ? new Date(project.endDate).getFullYear() : "Present"}
              </p>

              {/* Description */}
              {project.description && (
                <p style={{
                  fontSize: 13, color: "#6B6058", lineHeight: 1.65,
                  display: "-webkit-box", WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {project.description}
                </p>
              )}

              {/* Divider */}
              <div style={{ height: 1, background: "#F0EDE8", marginTop: "auto" }} />

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <EditProjectDialog project={project} />
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
                      <AlertDialogTitle>Delete project?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {project.title}. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(project.id)}>
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