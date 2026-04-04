import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../../../api/projectApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  url: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
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

export default function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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
          + Add Project
        </button>
      </DialogTrigger>
      <DialogContent style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 440 }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: "#1A1814" }}>
            Add Project
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => mutation.mutate({
          ...data,
          endDate: data.endDate === "" ? undefined : data.endDate,
        }))} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 4 }}>

          <div>
            <label style={labelStyle}>Title</label>
            <input style={inputStyle} placeholder="My Awesome Project" {...register("title")} />
            {errors.title && <p style={{ fontSize: 11, color: "#C4735A", marginTop: 3 }}>{errors.title.message}</p>}
          </div>

          <div>
            <label style={labelStyle}>Description <span style={{ color: "#B8B0A8" }}>(optional)</span></label>
            <textarea
              style={{ ...inputStyle, resize: "vertical", minHeight: 72, lineHeight: 1.6 }}
              placeholder="What did you build and what did you learn?"
              {...register("description")}
            />
          </div>

          <div>
            <label style={labelStyle}>URL <span style={{ color: "#B8B0A8" }}>(optional)</span></label>
            <input style={inputStyle} placeholder="https://github.com/..." {...register("url")} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={labelStyle}>Start Date</label>
              <input style={inputStyle} type="date" {...register("startDate")} />
              {errors.startDate && <p style={{ fontSize: 11, color: "#C4735A", marginTop: 3 }}>{errors.startDate.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>End Date <span style={{ color: "#B8B0A8" }}>(optional)</span></label>
              <input style={inputStyle} type="date" {...register("endDate")} />
            </div>
          </div>

          {mutation.isError && (
            <div style={{ background: "#FEF2EE", border: "1px solid #F5C4B5", borderRadius: 8, padding: "8px 12px" }}>
              <p style={{ fontSize: 12, color: "#C4735A" }}>Failed to create project.</p>
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
            {mutation.isPending ? "Saving..." : "Save Project"}
          </button>

        </form>
      </DialogContent>
    </Dialog>
  );
}