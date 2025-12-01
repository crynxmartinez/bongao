'use client'

import { useState } from 'react'
import { 
  Clock, 
  FolderKanban, 
  Award, 
  ScrollText, 
  Rocket, 
  GraduationCap,
  X
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Profile, ServicePeriod, Project, Legislation, Program, Achievement, Education } from '@/types'

interface ProfileStatsCardsProps {
  profile: Profile
  yearsInService: number
  servicePeriods: ServicePeriod[]
  projects: Project[]
  awards: Achievement[]
  legislation: Legislation[]
  programs: Program[]
  education: Education[]
}

type ModalType = 'yearsInService' | 'projects' | 'awards' | 'legislation' | 'programs' | 'education' | null

export function ProfileStatsCards({
  profile,
  yearsInService,
  servicePeriods,
  projects,
  awards,
  legislation,
  programs,
  education,
}: ProfileStatsCardsProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  // Build stats array based on toggle settings
  const stats: Array<{
    key: ModalType
    label: string
    value: number | string
    icon: React.ReactNode
    enabled: boolean
    hasData: boolean
  }> = [
    {
      key: 'yearsInService',
      label: 'Years in Service',
      value: yearsInService > 0 ? `${yearsInService}+` : '0',
      icon: <Clock className="w-6 h-6" />,
      enabled: profile.showYearsInService || false,
      hasData: servicePeriods.length > 0,
    },
    {
      key: 'projects',
      label: 'Projects',
      value: projects.length,
      icon: <FolderKanban className="w-6 h-6" />,
      enabled: profile.showProjects || false,
      hasData: projects.length > 0,
    },
    {
      key: 'awards',
      label: 'Awards',
      value: awards.length,
      icon: <Award className="w-6 h-6" />,
      enabled: profile.showAwards || false,
      hasData: awards.length > 0,
    },
    {
      key: 'legislation',
      label: 'Legislation',
      value: legislation.length,
      icon: <ScrollText className="w-6 h-6" />,
      enabled: profile.showLegislation || false,
      hasData: legislation.length > 0,
    },
    {
      key: 'programs',
      label: 'Programs',
      value: programs.length,
      icon: <Rocket className="w-6 h-6" />,
      enabled: profile.showPrograms || false,
      hasData: programs.length > 0,
    },
    {
      key: 'education',
      label: 'Education',
      value: education.length,
      icon: <GraduationCap className="w-6 h-6" />,
      enabled: profile.showEducation || false,
      hasData: education.length > 0,
    },
  ]

  // Filter to only show enabled stats with data
  const visibleStats = stats.filter(s => s.enabled && s.hasData)

  if (visibleStats.length === 0) {
    return null
  }

  return (
    <>
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {visibleStats.map((stat) => (
          <Card 
            key={stat.key}
            className="cursor-pointer hover:shadow-lg transition-shadow hover:border-primary"
            onClick={() => setActiveModal(stat.key)}
          >
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2 text-primary">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Years in Service Modal */}
      <Dialog open={activeModal === 'yearsInService'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Years in Service ({yearsInService}+ years)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {servicePeriods.map((period, index) => (
              <div key={period.id || index} className="flex gap-4 border-l-2 border-primary pl-4">
                <div>
                  <h4 className="font-semibold">{period.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {period.yearStart} - {period.yearEnd || 'Present'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Projects Modal */}
      <Dialog open={activeModal === 'projects'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-primary" />
              Projects ({projects.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {projects.map((project, index) => (
              <div key={project.id || index} className="border-b pb-3 last:border-0">
                <h4 className="font-semibold">{project.name}</h4>
                {project.year && (
                  <p className="text-sm text-muted-foreground">{project.year}</p>
                )}
                {project.description && (
                  <p className="text-sm mt-1">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Awards Modal */}
      <Dialog open={activeModal === 'awards'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Awards & Recognition ({awards.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {awards.map((award, index) => (
              <div key={award.id || index} className="border-b pb-3 last:border-0">
                <h4 className="font-semibold">{award.title}</h4>
                {award.year && (
                  <p className="text-sm text-muted-foreground">{award.year}</p>
                )}
                {award.description && (
                  <p className="text-sm mt-1">{award.description}</p>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Legislation Modal */}
      <Dialog open={activeModal === 'legislation'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-primary" />
              Legislation Authored ({legislation.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {legislation.map((leg, index) => (
              <div key={leg.id || index} className="border-b pb-3 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                    {leg.type}
                  </span>
                  {leg.number && (
                    <span className="text-xs text-muted-foreground">#{leg.number}</span>
                  )}
                </div>
                <h4 className="font-semibold mt-1">{leg.title}</h4>
                {leg.year && (
                  <p className="text-sm text-muted-foreground">{leg.year}</p>
                )}
                {leg.description && (
                  <p className="text-sm mt-1">{leg.description}</p>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Programs Modal */}
      <Dialog open={activeModal === 'programs'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              Programs & Initiatives ({programs.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {programs.map((prog, index) => (
              <div key={prog.id || index} className="border-b pb-3 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    prog.status === 'ONGOING' ? 'bg-green-100 text-green-700' :
                    prog.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {prog.status}
                  </span>
                </div>
                <h4 className="font-semibold mt-1">{prog.name}</h4>
                {prog.description && (
                  <p className="text-sm mt-1">{prog.description}</p>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Education Modal */}
      <Dialog open={activeModal === 'education'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Education ({education.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {education.map((edu, index) => (
              <div key={edu.id || index} className="border-b pb-3 last:border-0">
                <h4 className="font-semibold">{edu.degree}</h4>
                <p className="text-muted-foreground">{edu.school}</p>
                {edu.year && (
                  <p className="text-sm text-muted-foreground">{edu.year}</p>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
