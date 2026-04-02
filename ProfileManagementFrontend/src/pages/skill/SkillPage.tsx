import { deleteSkill, getSkills } from "@/api/skillApi";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SkillResponse } from "@/types/skill";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import EditSkillDialog from "./components/EditSkillDialog";
import CreateSkillDialog from "./components/CreateSkillDialog";

export default function SkillPage() {
  const queryClient = useQueryClient();

  const proficiencyLabels: Record<number, string> = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
}

  const {
    data: skills,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error)
    return <div className="p-8 text-red-500">Failed to load skills</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Skills</h1>
        <CreateSkillDialog />
      </div>

      {skills?.length === 0 && (
      <p className="text-gray-500 text-center mt-12">No skills found.</p>
    )}
      <div className="space-y-4">
        {skills?.map((skill: SkillResponse) => (
          <Card key={skill.id}>
            <CardHeader>
              <CardTitle>{skill.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mt-1">
                {proficiencyLabels[skill.proficiencyLevel] || skill.proficiencyLevel}
              </p>

              <div className="flex gap-2 mt-4">
                <EditSkillDialog skill={skill} />
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
                        This will permanently delete this skill record.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(skill.id)}
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
