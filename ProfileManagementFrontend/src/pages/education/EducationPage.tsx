import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEducations, deleteEducation } from "../../api/educationApi";
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
import type { EducationResponse } from "../../types/education";
import CreateEducationDialog from "./components/CreateEducationDialog";
import EditEducationDialog from "./components/EditEducationDialog";

export default function EducationPage() {
  const queryClient = useQueryClient();

  const {
    data: educations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["educations"],
    queryFn: getEducations,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educations"] });
    },
  });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error)
    return <div className="p-8 text-red-500">Failed to load educations</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Education</h1>
        <CreateEducationDialog />{" "}
      </div>

      {educations?.length === 0 && (
        <p className="text-gray-500 text-center mt-12">
          No education records found.
        </p>
      )}

      <div className="space-y-4">
        {educations?.map((education: EducationResponse) => (
          <Card key={education.id}>
            <CardHeader>
              <CardTitle className="text-lg">{education.institution}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {education.degree} — {education.fieldOfStudy}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(education.startDate).getFullYear()} —{" "}
                {education.endDate
                  ? new Date(education.endDate).getFullYear()
                  : "Present"}
              </p>
              {education.description && (
                <p className="text-sm mt-2">{education.description}</p>
              )}
              <div className="flex gap-2 mt-4">
                <EditEducationDialog education={education} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this education record.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(education.id)}
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
