import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSocialLinks, deleteSocialLink } from "../../api/socialLinkApi";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { SocialLinkResponse } from "../../types/socialLink";
import CreateSocialLinkDialog from "./components/CreateSocialLinkDialog";
import EditSocialLinkDialog from "./components/EditSocialLinkDialog";
import { HiLink, HiExternalLink } from "react-icons/hi";

const platformLabel: Record<number, string> = {
  1: "LinkedIn", 2: "GitHub", 3: "Twitter", 4: "Website", 5: "Other",
};

const platformColor: Record<number, string> = {
  1: "#0A66C2", 2: "#1A1814", 3: "#1DA1F2", 4: "#C4A882", 5: "#8C8278",
};

export default function SocialLinkPage() {
  const queryClient = useQueryClient();

  const { data: socialLinks, isLoading, error } = useQuery({
    queryKey: ["socialLinks"],
    queryFn: getSocialLinks,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSocialLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["socialLinks"] }),
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
      <p style={{ fontSize: 13, color: "#C4735A" }}>Failed to load social links.</p>
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
              Social Links
            </h1>
            <div style={{ width: 32, height: 1.5, background: "#1A1814", marginTop: 12 }} />
          </div>
          <CreateSocialLinkDialog />
        </div>

        {/* Empty State */}
        {socialLinks?.length === 0 && (
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
              <HiLink style={{ width: 22, height: 22, color: "#C4A882" }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1814", marginBottom: 6 }}>No social links yet</p>
            <p style={{ fontSize: 13, color: "#B8B0A8" }}>Add your social profiles to help people connect with you.</p>
          </div>
        )}

        {/* Links List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {socialLinks?.map((link: SocialLinkResponse) => (
            <div key={link.id} style={{
              background: "white", borderRadius: 20,
              border: "1px solid #F0EDE8",
              boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
              padding: "20px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
            }}>
              {/* Left */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: "#F5F0EA",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: platformColor[link.platform],
                  }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#1A1814", marginBottom: 3 }}>
                    {platformLabel[link.platform]}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: 12, color: "#B8B0A8", textDecoration: "none",
                      display: "flex", alignItems: "center", gap: 4,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      maxWidth: 320,
                    }}
                  >
                    <HiExternalLink style={{ width: 11, height: 11, flexShrink: 0 }} />
                    {link.url}
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <EditSocialLinkDialog socialLink={link} />
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
                      <AlertDialogTitle>Delete social link?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your {platformLabel[link.platform]} link. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(link.id)}>
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