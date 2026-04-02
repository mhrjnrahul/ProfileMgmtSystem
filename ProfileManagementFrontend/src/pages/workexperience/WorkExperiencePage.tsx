import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkExperiences, deleteWorkExperience } from "../../api/workExperienceApi";
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
import type { WorkExperienceResponse } from "../../types/workexperience";
import CreateWorkExperienceDialog from "./components/CreateWorkExperienceDialog";
import EditWorkExperienceDialog from "./components/EditWorkExperienceDialog";

export default function WorkExperiencePage() {
    const queryClient = useQueryClient();

    const {
        data: workExperiences,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["workExperiences"],
        queryFn: getWorkExperiences,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteWorkExperience,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workExperiences"] });
        },
    });

    if(isLoading) return <div className="p-8">Loading...</div>;
    if(error) return <div className="p-8 text-red-500">Failed to load work experiences</div>;

    return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Work Experience</h1>
        <CreateWorkExperienceDialog />
      </div>

      {workExperiences?.length === 0 && (
        <p className="text-gray-500 text-center mt-12">
          No work experience records found.
        </p>
      )}

      <div className="space-y-4">
        {workExperiences?.map((workExperience: WorkExperienceResponse) => (
          <Card key={workExperience.id}>
            <CardHeader>
              <CardTitle>{workExperience.company}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{workExperience.position}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(workExperience.startDate).getFullYear()} —{' '}
                {workExperience.isCurrent ? 'Present' : workExperience.endDate ? new Date(workExperience.endDate).getFullYear() : ''}
              </p>
              {workExperience.description && (
                <p className="text-sm mt-2">{workExperience.description}</p>
              )}
              <div className="flex gap-2 mt-4">
                <EditWorkExperienceDialog workexperience={workExperience} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this work experience record.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(workExperience.id)}
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