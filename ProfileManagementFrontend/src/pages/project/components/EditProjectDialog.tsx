import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "../../../api/projectApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProjectResponse } from "../../../types/project";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  project: ProjectResponse;
}

const editProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  url: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});

type EditProjectFormData = z.infer<typeof editProjectSchema>;

export default function EditProjectDialog({ project }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProjectFormData>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      url: project.url,
      startDate: project.startDate.split("T")[0],
      endDate: project.endDate?.split("T")[0],
    },
  });

  const mutation = useMutation({
    mutationFn: (data: EditProjectFormData & { id: number }) =>
      updateProject(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      reset();
      setOpen(false);
    },
  });

  const onSubmit = async (data: EditProjectFormData) => {
    mutation.mutate({ id: project.id, ...data });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input placeholder="My Awesome Project" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Description (optional)</Label>
            <Input placeholder="Brief description..." {...register("description")} />
          </div>

          <div className="space-y-1">
            <Label>URL (optional)</Label>
            <Input placeholder="https://github.com/..." {...register("url")} />
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

          {mutation.isError && (
            <p className="text-sm text-red-500 text-center">
              Failed to update project
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