import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSkill } from "@/api/skillApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  proficiencyLevel: z.number().min(1, "Proficiency level is required"),
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

const levels = [
  { value: 1, label: "Beginner", width: "25%" },
  { value: 2, label: "Intermediate", width: "50%" },
  { value: 3, label: "Advanced", width: "75%" },
  { value: 4, label: "Expert", width: "100%" },
];

export default function CreateSkillDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    name: "",
    proficiencyLevel: 0,
  },
});

  const mutation = useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      reset();
      setOpen(false);
    },
  });

  const selectedLevel = watch("proficiencyLevel");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button style={{
          background: "#1A1814", color: "white", border: "none",
          borderRadius: 10, padding: "9px 20px", fontSize: 13,
          fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>
          + Add Skill
        </button>
      </DialogTrigger>
      <DialogContent style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 440 }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: "#1A1814" }}>
            Add Skill
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 4 }}>

          <div>
            <label style={labelStyle}>Skill Name</label>
            <input style={inputStyle} placeholder="e.g. React, Python, Figma" {...register("name")} />
            {errors.name && <p style={{ fontSize: 11, color: "#C4735A", marginTop: 3 }}>{errors.name.message}</p>}
          </div>

          {/* Proficiency selector */}
          <div>
            <label style={labelStyle}>Proficiency Level</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              {levels.map((level) => {
                const isSelected = selectedLevel === level.value;
                return (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setValue("proficiencyLevel", level.value, {shouldValidate: true})}
                    style={{
                      padding: "8px 4px", borderRadius: 10, fontSize: 11, fontWeight: 500,
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                      border: `1.5px solid ${isSelected ? "#C4A882" : "#EDE8E3"}`,
                      background: isSelected ? "#F5F0EA" : "white",
                      color: isSelected ? "#A8895E" : "#8C8278",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {level.label}
                  </button>
                );
              })}
            </div>
            {/* Preview bar */}
            {selectedLevel && (
              <div style={{ background: "#F0EDE8", borderRadius: 100, height: 3, marginTop: 10, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 100,
                  background: "linear-gradient(90deg, #C4A882, #A8895E)",
                  width: levels.find(l => l.value === selectedLevel)?.width ?? "0%",
                  transition: "width 0.3s ease",
                }} />
              </div>
            )}
            {errors.proficiencyLevel && <p style={{ fontSize: 11, color: "#C4735A", marginTop: 3 }}>{errors.proficiencyLevel.message}</p>}
          </div>

          {mutation.isError && (
            <div style={{ background: "#FEF2EE", border: "1px solid #F5C4B5", borderRadius: 8, padding: "8px 12px" }}>
              <p style={{ fontSize: 12, color: "#C4735A" }}>Failed to create skill.</p>
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
            {mutation.isPending ? "Saving..." : "Save Skill"}
          </button>

        </form>
      </DialogContent>
    </Dialog>
  );
}