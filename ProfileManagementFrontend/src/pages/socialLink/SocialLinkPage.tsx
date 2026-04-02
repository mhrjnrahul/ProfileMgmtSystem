import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSocialLinks, deleteSocialLink } from "../../api/socialLinkApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { SocialLinkResponse } from "../../types/socialLink";
import CreateSocialLinkDialog from "./components/CreateSocialLinkDialog";
import EditSocialLinkDialog from "./components/EditSocialLinkDialog";

const platformLabels: Record<number, string> = {
  1: "LinkedIn",
  2: "GitHub",
  3: "Twitter",
  4: "Website",
  5: "Other",
};

export default function SocialLinkPage() {
  const queryClient = useQueryClient();

  const { data: socialLinks, isLoading, error } = useQuery({
    queryKey: ["socialLinks"],
    queryFn: getSocialLinks,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSocialLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
    },
  });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load social links</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Social Links</h1>
        <CreateSocialLinkDialog />
      </div>

      {socialLinks?.length === 0 && (
        <p className="text-gray-500 text-center mt-12">No social links found.</p>
      )}

      <div className="space-y-4">
        {socialLinks?.map((socialLink: SocialLinkResponse) => (
          <Card key={socialLink.id}>
            <CardHeader>
              <CardTitle>{platformLabels[socialLink.platform] || "Other"}</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={socialLink.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {socialLink.url}
              </a>
              <div className="flex gap-2 mt-4">
                <EditSocialLinkDialog socialLink={socialLink} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this social link.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(socialLink.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}