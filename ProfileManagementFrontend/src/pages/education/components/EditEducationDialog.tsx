import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateEducation } from '../../../api/educationApi'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { EducationResponse } from '../../../types/education'

const schema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const inputStyle = {
  width: '100%', background: 'white',
  border: '1.5px solid #EDE8E3', borderRadius: 10,
  padding: '10px 14px', fontSize: 13, color: '#1A1814',
  outline: 'none', fontFamily: "'DM Sans', sans-serif",
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box' as const,
}

const labelStyle = {
  fontSize: 11, color: '#6B6058', fontWeight: 500,
  display: 'block', marginBottom: 5, letterSpacing: '0.02em',
}

export default function EditEducationDialog({ education }: { education: EducationResponse }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      institution: education.institution,
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy,
      startDate: education.startDate.split('T')[0],
      endDate: education.endDate ? education.endDate.split('T')[0] : '',
      description: education.description ?? '',
    },
  })

  const mutation = useMutation({
  mutationFn: (data: FormData) => updateEducation(education.id, { ...data, id: education.id }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['educations'] })
    setOpen(false)
  },
})

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button style={{
          fontSize: 12, color: '#6B6058', background: '#F5F0EA',
          border: '1px solid #EDE8E3', borderRadius: 8,
          padding: '6px 14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          transition: 'background 0.15s ease',
        }}>
          Edit
        </button>
      </DialogTrigger>
      <DialogContent style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 440 }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: '#1A1814' }}>
            Edit Education
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>

          <div>
            <label style={labelStyle}>Institution</label>
            <input style={inputStyle} placeholder="Tribhuvan University" {...register('institution')} />
            {errors.institution && <p style={{ fontSize: 11, color: '#C4735A', marginTop: 3 }}>{errors.institution.message}</p>}
          </div>

          <div>
            <label style={labelStyle}>Degree</label>
            <input style={inputStyle} placeholder="Bachelor of Science" {...register('degree')} />
            {errors.degree && <p style={{ fontSize: 11, color: '#C4735A', marginTop: 3 }}>{errors.degree.message}</p>}
          </div>

          <div>
            <label style={labelStyle}>Field of Study</label>
            <input style={inputStyle} placeholder="Computer Science" {...register('fieldOfStudy')} />
            {errors.fieldOfStudy && <p style={{ fontSize: 11, color: '#C4735A', marginTop: 3 }}>{errors.fieldOfStudy.message}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Start Date</label>
              <input style={inputStyle} type="date" {...register('startDate')} />
              {errors.startDate && <p style={{ fontSize: 11, color: '#C4735A', marginTop: 3 }}>{errors.startDate.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>End Date <span style={{ color: '#B8B0A8' }}>(optional)</span></label>
              <input style={inputStyle} type="date" {...register('endDate')} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description <span style={{ color: '#B8B0A8' }}>(optional)</span></label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 72, lineHeight: 1.6 }}
              placeholder="Brief description..."
              {...register('description')}
            />
          </div>

          {mutation.isError && (
            <div style={{ background: '#FEF2EE', border: '1px solid #F5C4B5', borderRadius: 8, padding: '8px 12px' }}>
              <p style={{ fontSize: 12, color: '#C4735A' }}>Failed to update education record.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            style={{
              background: '#1A1814', color: 'white', border: 'none',
              borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 500,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting || mutation.isPending ? 0.6 : 1,
              fontFamily: "'DM Sans', sans-serif",
              transition: 'background 0.2s ease',
              marginTop: 4,
            }}
          >
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>

        </form>
      </DialogContent>
    </Dialog>
  )
}