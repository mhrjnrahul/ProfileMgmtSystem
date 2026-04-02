import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSocialLink } from "../../../api/socialLinkApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SocialLinkResponse } from "../../../types/socialLink";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  socialLink: SocialLinkResponse;
}

const editSocialLinkSchema = z.object({
  platform: z.number().min(1).max(5),
  url: z.string().min(1, "URL is required"),
});

type EditSocialLinkFormData = z.infer<typeof editSocialLinkSchema>;

export default function EditSocialLinkDialog({ socialLink }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditSocialLinkFormData>({
    resolver: zodResolver(editSocialLinkSchema),
    defaultValues: {
      platform: socialLink.platform,
      url: socialLink.url,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: EditSocialLinkFormData & { id: number }) =>
      updateSocialLink(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      reset();
      setOpen(false);
    },
  });

  const onSubmit = async (data: EditSocialLinkFormData) => {
    mutation.mutate({ id: socialLink.id, ...data });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Social Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>Platform</Label>
            <select
              {...register("platform", { valueAsNumber: true })}
              className="w-full border rounded-md p-2 text-sm"
            >
              <option value={1}>LinkedIn</option>
              <option value={2}>GitHub</option>
              <option value={3}>Twitter</option>
              <option value={4}>Website</option>
              <option value={5}>Other</option>
            </select>
            {errors.platform && (
              <p className="text-sm text-red-500">{errors.platform.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>URL</Label>
            <Input placeholder="https://linkedin.com/in/..." {...register("url")} />
            {errors.url && (
              <p className="text-sm text-red-500">{errors.url.message}</p>
            )}
          </div>

          {mutation.isError && (
            <p className="text-sm text-red-500 text-center">
              Failed to update social link
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