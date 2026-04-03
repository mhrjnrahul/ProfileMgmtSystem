import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkExperience } from "@/api/workExperienceApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const schema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
  isCurrent: z.boolean(),
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

export default function CreateWorkExperienceDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isCurrent: false },
  });

  const mutation = useMutation({
    mutationFn: createWorkExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workExperiences"] });
      reset();
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button style={{
          background: "#1A1814", color: "white", border: "none",
          borderRadius: 10, padding: "9px 20px", fontSize: 13,
          fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>
          + Add Experience
        </button>
      </DialogTrigger>
      <DialogContent style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 440 }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: "#1A1814" }}>
            Add Work Experience
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 4 }}>

          <div>
            <label style={labelStyle}>Company</label>
            <input style={inputStyle} placeholder="Google" {...register("company")} />
            {errors.company && <p style={{ fontSize: 11, color: "#C4735A", marginTop: 3 }}>{errors.company.message}</p>}
          </div>

          <div>
            <label style={labelStyle}>Position</label>
            <input style={inputStyle} placeholder="Software Engineer" {...register("position")} />
            {errors.position && <p style={{ fontSize: 11, color: "#C4735A", marginTop: 3 }}>{errors.position.message}</p>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={labelStyle}>Start Date</label>
              <input style={inputStyle} type="date" {...register("startDate")} />
              {errors.startDate && <p style={{ fontSize: 11, color: "#C4735A", marginTop: 3 }}>{errors.startDate.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>End Date <span style={{ color: "#B8B0A8" }}>(optional)</span></label>
              <input style={inputStyle} type="date" {...register("endDate")} disabled={watch("isCurrent")} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description <span style={{ color: "#B8B0A8" }}>(optional)</span></label>
            <textarea
              style={{ ...inputStyle, resize: "vertical", minHeight: 72, lineHeight: 1.6 }}
              placeholder="Brief description of your role..."
              {...register("description")}
            />
          </div>

          {/* isCurrent checkbox */}
          <div
            onClick={() => setValue("isCurrent", !watch("isCurrent"))}
            style={{
              display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
              background: watch("isCurrent") ? "#F5F0EA" : "transparent",
              border: `1.5px solid ${watch("isCurrent") ? "#C4A882" : "#EDE8E3"}`,
              borderRadius: 10, padding: "10px 14px",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: 5, flexShrink: 0,
              border: `2px solid ${watch("isCurrent") ? "#C4A882" : "#D4CBC2"}`,
              background: watch("isCurrent") ? "#C4A882" : "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease",
            }}>
              {watch("isCurrent") && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 13, color: watch("isCurrent") ? "#1A1814" : "#8C8278" }}>
              Currently working here
            </span>
          </div>

          {mutation.isError && (
            <div style={{ background: "#FEF2EE", border: "1px solid #F5C4B5", borderRadius: 8, padding: "8px 12px" }}>
              <p style={{ fontSize: 12, color: "#C4735A" }}>Failed to create work experience record.</p>
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
              fontFamily: "'DM Sans', sans-serif",
              marginTop: 4,
            }}
          >
            {mutation.isPending ? "Saving..." : "Save Experience"}
          </button>

        </form>
      </DialogContent>
    </Dialog>
  );
}