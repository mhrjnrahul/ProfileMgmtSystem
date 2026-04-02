import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSkill } from "@/api/skillApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const createSkillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  proficiencyLevel: z.number().min(1, "Proficiency level is required"),
});

type CreateSkillFormData = z.infer<typeof createSkillSchema>;

export default function CreateSkillDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSkillFormData>({
    resolver: zodResolver(createSkillSchema),
  });

  const mutation = useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      reset();
      setOpen(false);
    },
  });

  const onSubmit = async (data: CreateSkillFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Skill</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Skill</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input placeholder="Python" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Proficiency Level</Label>
            <select
              {...register("proficiencyLevel", { valueAsNumber: true })}
              className="w-full border rounded-md p-2 text-sm"
            >
              <option value="">Select level</option>
              <option value={1}>Beginner</option>
              <option value={2}>Intermediate</option>
              <option value={3}>Advanced</option>
              <option value={4}>Expert</option>
            </select>
            {errors.proficiencyLevel && (
              <p className="text-sm text-red-500">
                {errors.proficiencyLevel.message}
              </p>
            )}
          </div>

          {mutation.isError && (
            <p className="text-sm text-red-500 text-center">
              Failed to create skill record
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
