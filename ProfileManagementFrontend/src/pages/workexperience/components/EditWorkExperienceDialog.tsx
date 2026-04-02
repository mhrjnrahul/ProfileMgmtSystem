import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorkExperience } from "@/api/workExperienceApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WorkExperienceResponse } from "../../../types/workexperience";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  workexperience: WorkExperienceResponse;
}

const updateWorkExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
  isCurrent: z.boolean(),
});

type UpdateWorkExperienceFormData = z.infer<typeof updateWorkExperienceSchema>;

export default function EditWorkExperienceDialog({ workexperience }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateWorkExperienceFormData>({
    resolver: zodResolver(updateWorkExperienceSchema),
    defaultValues: {
      company: workexperience.company,
      position: workexperience.position,
      startDate: workexperience.startDate.split("T")[0],
      endDate: workexperience.endDate?.split("T")[0],
      description: workexperience.description,
      isCurrent: workexperience.isCurrent,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: UpdateWorkExperienceFormData & { id: number }) =>
      updateWorkExperience(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workExperiences"] });
      reset();
      setOpen(false);
    },
  });

  const onSubmit = async (data: UpdateWorkExperienceFormData) => {
    mutation.mutate({ id: workexperience.id, ...data });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Work Experience</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>Company</Label>
            <Input placeholder="Google" {...register("company")} />
            {errors.company && (
              <p className="text-sm text-red-500">{errors.company.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Position</Label>
            <Input placeholder="Software Engineer" {...register("position")} />
            {errors.position && (
              <p className="text-sm text-red-500">{errors.position.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Start Date</Label>
            <Input type="date" {...register("startDate")} />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>End Date (optional)</Label>
            <Input type="date" {...register("endDate")} />
          </div>

          <div className="space-y-1">
            <Label>Description (optional)</Label>
            <Input
              placeholder="Brief description..."
              {...register("description")}
            />
          </div>

          <div className="space-y-1">
            <input
              type="checkbox"
              id="isCurrent"
              checked={watch("isCurrent")}
              onChange={(e) => setValue("isCurrent", e.target.checked)}
            />
            <Label htmlFor="isCurrent">Currently working here</Label>
          </div>

          {mutation.isError && (
            <p className="text-sm text-red-500 text-center">
              Failed to update education record
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
