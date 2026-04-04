import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSocialLink } from "../../../api/socialLinkApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const schema = z.object({
  platform: z.number().min(1).max(5),
  url: z.string().min(1, "URL is required"),
});

type FormData = z.infer<typeof schema>;

const inputStyle = {
  width: "100%", background: "white",
  border: "1.5px solid #EDE8E3", borderRadius: 10,
  padding: "10px 14px", fontSize: 13, color: "#1A1814",
  outline: "none", fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  fontSize: 11, color: "#6B6058", fontWeight: 500,
  display: "block", marginBottom: 5, letterSpacing: "0.02em",
};

const platforms = [
  { value: 1, label: "LinkedIn" },
  { value: 2, label: "GitHub" },
  { value: 3, label: "Twitter" },
  { value: 4, label: "Website" },
  { value: 5, label: "Other" },
];

export default function CreateSocialLinkDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { platform: 0, url: "" },
  });

  const mutation = useMutation({
    mutationFn: createSocialLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      reset();
      setOpen(false);
    },
  });

  const selectedPlatform = watch("platform");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button style={{
          background: "#1A1814", color: "white", border: "none",
          borderRadius: 10, padding: "9px 20px", fontSize: 13,
          fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>
          + Add Link
        </button>
      </DialogTrigger>
      <DialogContent style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 440 }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: "#1A1814" }}>
            Add Social Link
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 4 }}>

          {/* Platform selector */}
          <div>
            <label style={labelStyle}>Platform</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {platforms.map((p) => {
                const isSelected = selectedPlatform === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setValue("platform", p.value, { shouldValidate: true })}
                    style={{
                      padding: "9px 4px", borderRadius: 10, fontSize: 12, fontWeight: 500,
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                      border: `1.5px solid ${isSelected ? "#C4A882" : "#EDE8E3"}`,
                      background: isSelected ? "#F5F0EA" : "white",
                      color: isSelected ? "#A8895E" : "#8C8278",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
            {errors.platform && <p style={{ fontSize: 11, color: "#C4735A", marginTop: 3 }}>Please select a platform</p>}
          </div>

          <div>
            <label style={labelStyle}>URL</label>
            <input style={inputStyle} placeholder="https://linkedin.com/in/yourname" {...register("url")} />
            {errors.url && <p style={{ fontSize: 11, color: "#C4735A", marginTop: 3 }}>{errors.url.message}</p>}
          </div>

          {mutation.isError && (
            <div style={{ background: "#FEF2EE", border: "1px solid #F5C4B5", borderRadius: 8, padding: "8px 12px" }}>
              <p style={{ fontSize: 12, color: "#C4735A" }}>Failed to create social link.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            style={{
              background: "#1A1814", color: "white", border: "none",
              borderRadius: 10, padding: "11px", fontSize: 13, fontWeight: 500,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting || mutation.isPending ? 0.6 : 1,
              fontFamily: "'DM Sans', sans-serif", marginTop: 4,
            }}
          >
            {mutation.isPending ? "Saving..." : "Save Link"}
          </button>

        </form>
      </DialogContent>
    </Dialog>
  );
}