import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getMyProfile, updateMyProfile } from "@/api/profileApi";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HiUser } from "react-icons/hi";

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
      firstName: "",
      lastName: "",
      bio: "",
      city: "",
      country: "",
      dateOfBirth: "",
      profilePicture: "",
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
      setUser({ ...user!, firstName: data.firstName, lastName: data.lastName });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({
      ...data,
      dateOfBirth: data.dateOfBirth === "" ? null : data.dateOfBirth,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Account
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <div className="w-12 h-0.5 bg-gray-900 mt-3" />
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-white text-xl font-semibold">
            {profile?.firstName?.[0]}{profile?.lastName?.[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {profile?.firstName} {profile?.lastName}
            </p>
            <p className="text-xs text-gray-400">{profile?.email}</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-6">
            Basic Information
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">First Name</label>
                <Input {...register("firstName")} placeholder="John" />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Last Name</label>
                <Input {...register("lastName")} placeholder="Doe" />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Bio</label>
              <Textarea {...register("bio")} placeholder="Tell us about yourself..." rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">City</label>
                <Input {...register("city")} placeholder="Kathmandu" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Country</label>
                <Input {...register("country")} placeholder="Nepal" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Date of Birth</label>
              <Input type="date" {...register("dateOfBirth")} />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Profile Picture URL</label>
              <Input {...register("profilePicture")} placeholder="https://..." />
            </div>

            {mutation.isSuccess && (
              <p className="text-xs text-emerald-600 font-medium">Profile updated successfully.</p>
            )}

            {mutation.isError && (
              <p className="text-xs text-red-500 font-medium">Something went wrong. Please try again.</p>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSubmitting || mutation.isPending} className="flex items-center gap-2">
                <HiUser className="w-4 h-4" />
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}