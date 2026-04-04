import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getMyProfile, updateMyProfile } from "@/api/profileApi";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  bio: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  dateOfBirth: z.string().optional(),
  profilePicture: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputStyle = {
  width: "100%", background: "white",
  border: "1.5px solid #EDE8E3", borderRadius: 10,
  padding: "10px 14px", fontSize: 13, color: "#1A1814",
  outline: "none", fontFamily: "'DM Sans', sans-serif",
  transition: "border-color 0.2s ease",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  fontSize: 11, color: "#6B6058", fontWeight: 500,
  display: "block", marginBottom: 5, letterSpacing: "0.02em",
};

export default function ProfileSettingsPage() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "", lastName: "", bio: "",
      city: "", country: "", dateOfBirth: "", profilePicture: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio ?? "",
        city: profile.city ?? "",
        country: profile.country ?? "",
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split("T")[0] : "",
        profilePicture: profile.profilePicture ?? "",
      });
    }
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      queryClient.invalidateQueries({ queryKey: ["publicProfile", profile?.id] });
      queryClient.invalidateQueries({ queryKey: ["publicEducations", profile?.id] });
      queryClient.invalidateQueries({ queryKey: ["publicWorkExperiences", profile?.id] });
      queryClient.invalidateQueries({ queryKey: ["publicSkills", profile?.id] });
      queryClient.invalidateQueries({ queryKey: ["publicProjects", profile?.id] });
      queryClient.invalidateQueries({ queryKey: ["publicSocialLinks", profile?.id] });
      setUser({ ...user!, firstName: data.firstName, lastName: data.lastName });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({
      ...data,
      dateOfBirth: data.dateOfBirth === "" ? null : data.dateOfBirth,
    });
  };

  if (isLoading) return (
    <div style={{ minHeight: "100vh", background: "#FAF9F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
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

  return (
    <div style={{ minHeight: "100vh", background: "#FAF9F7", padding: "40px 32px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 10, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 8 }}>
            Account
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 400, color: "#1A1814", lineHeight: 1.1, fontFamily: "'Cormorant Garamond', serif" }}>
            Profile Settings
          </h1>
          <div style={{ width: 32, height: 1.5, background: "#1A1814", marginTop: 12 }} />
        </div>

        {/* Avatar row */}
        <div style={{
          background: "white", borderRadius: 20, border: "1px solid #F0EDE8",
          boxShadow: "0 2px 8px rgba(26,24,20,0.04)",
          padding: "20px 24px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #1A1814, #3D2E1E)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#E8D5B7", fontSize: 18, fontWeight: 600,
          }}>
            {profile?.firstName?.[0]}{profile?.lastName?.[0]}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1814" }}>
              {profile?.firstName} {profile?.lastName}
            </p>
            <p style={{ fontSize: 12, color: "#B8B0A8" }}>{profile?.email}</p>
          </div>
        </div>

        {/* Form */}
        <div style={{
          background: "white", borderRadius: 20, border: "1px solid #F0EDE8",
          boxShadow: "0 2px 8px rgba(26,24,20,0.04)", padding: "28px",
        }}>
          <p style={{ fontSize: 10, color: "#C4B8AC", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 22 }}>
            Basic Information
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input style={inputStyle} placeholder="John" {...register("firstName")} />
                {errors.firstName && <p style={{ fontSize: 11, color: "#C4735A", marginTop: 3 }}>{errors.firstName.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input style={inputStyle} placeholder="Doe" {...register("lastName")} />
                {errors.lastName && <p style={{ fontSize: 11, color: "#C4735A", marginTop: 3 }}>{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Bio</label>
              <textarea
                style={{ ...inputStyle, resize: "vertical", minHeight: 88, lineHeight: 1.65 }}
                placeholder="Tell us about yourself..."
                {...register("bio")}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>City</label>
                <input style={inputStyle} placeholder="Kathmandu" {...register("city")} />
              </div>
              <div>
                <label style={labelStyle}>Country</label>
                <input style={inputStyle} placeholder="Nepal" {...register("country")} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Date of Birth</label>
              <input style={inputStyle} type="date" {...register("dateOfBirth")} />
            </div>

            <div>
              <label style={labelStyle}>Profile Picture URL</label>
              <input style={inputStyle} placeholder="https://..." {...register("profilePicture")} />
            </div>

            {mutation.isSuccess && (
              <div style={{ background: "#EDFAF3", border: "1px solid #A8D5B5", borderRadius: 8, padding: "8px 12px" }}>
                <p style={{ fontSize: 12, color: "#2D7A4F" }}>Profile updated successfully.</p>
              </div>
            )}

            {mutation.isError && (
              <div style={{ background: "#FEF2EE", border: "1px solid #F5C4B5", borderRadius: 8, padding: "8px 12px" }}>
                <p style={{ fontSize: 12, color: "#C4735A" }}>Something went wrong. Please try again.</p>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
              <button
                type="submit"
                disabled={isSubmitting || mutation.isPending}
                style={{
                  background: "#1A1814", color: "white", border: "none",
                  borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 500,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting || mutation.isPending ? 0.6 : 1,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}