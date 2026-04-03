import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorkExperience } from "@/api/workExperienceApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { WorkExperienceResponse } from "@/types/workexperience";

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

export default function EditWorkExperienceDialog({ workexperience }: { workexperience: WorkExperienceResponse }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      company: workexperience.company,
      position: workexperience.position,
      startDate: workexperience.startDate.split("T")[0],
      endDate: workexperience.endDate ? workexperience.endDate.split("T")[0] : "",
      description: workexperience.description ?? "",
      isCurrent: workexperience.isCurrent,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => updateWorkExperience(workexperience.id, { ...data, id: workexperience.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workExperiences"] });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button style={{
          fontSize: 12, color: "#6B6058", background: "#F5F0EA",
          border: "1px solid #EDE8E3", borderRadius: 8,
          padding: "6px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>
          Edit
        </button>
      </DialogTrigger>
      <DialogContent style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 440 }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: "#1A1814" }}>
            Edit Work Experience
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
              <p style={{ fontSize: 12, color: "#C4735A" }}>Failed to update work experience record.</p>
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
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </DialogContent>
    </Dialog>
  );
}