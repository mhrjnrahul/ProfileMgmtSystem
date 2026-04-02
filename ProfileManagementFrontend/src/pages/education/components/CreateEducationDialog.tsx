import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEducation } from '../../../api/educationApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const createEducationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
})

type CreateEducationFormData = z.infer<typeof createEducationSchema>

export default function CreateEducationDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateEducationFormData>({
    resolver: zodResolver(createEducationSchema),
  })

  const mutation = useMutation({
    mutationFn: createEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] })
      reset()
      setOpen(false)
    },
  })

  const onSubmit = async (data: CreateEducationFormData) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Education</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Education</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-1">
            <Label>Institution</Label>
            <Input placeholder="Harvard University" {...register('institution')} />
            {errors.institution && (
              <p className="text-sm text-red-500">{errors.institution.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Degree</Label>
            <Input placeholder="Bachelor of Science" {...register('degree')} />
            {errors.degree && (
              <p className="text-sm text-red-500">{errors.degree.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Field of Study</Label>
            <Input placeholder="Computer Science" {...register('fieldOfStudy')} />
            {errors.fieldOfStudy && (
              <p className="text-sm text-red-500">{errors.fieldOfStudy.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Start Date</Label>
            <Input type="date" {...register('startDate')} />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>End Date (optional)</Label>
            <Input type="date" {...register('endDate')} />
          </div>

          <div className="space-y-1">
            <Label>Description (optional)</Label>
            <Input placeholder="Brief description..." {...register('description')} />
          </div>

          {mutation.isError && (
            <p className="text-sm text-red-500 text-center">
              Failed to create education record
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  )
}