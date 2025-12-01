'use client'

import { useState } from 'react'
import { 
  Clock, 
  FolderKanban, 
  Award, 
  ScrollText, 
  Rocket, 
  GraduationCap,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
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
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Years in Service ({yearsInService}+ years)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {servicePeriods.map((period, index) => (
              <div key={period.id || index} className="flex gap-4 border-l-2 border-primary pl-4 py-2">
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-primary" />
              Projects ({projects.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {projects.map((project, index) => {
              const itemId = `project-${project.id || index}`
              const isExpanded = expandedItems.has(itemId)
              const hasDescription = !!project.description
              
              return (
                <Collapsible key={itemId} open={isExpanded} onOpenChange={() => hasDescription && toggleExpanded(itemId)}>
                  <div className="border rounded-lg p-3">
                    <CollapsibleTrigger asChild disabled={!hasDescription}>
                      <div className={`flex items-center justify-between ${hasDescription ? 'cursor-pointer' : ''}`}>
                        <div className="flex-1">
                          <h4 className="font-semibold">{project.name}</h4>
                          {project.year && (
                            <p className="text-sm text-muted-foreground">{project.year}</p>
                          )}
                        </div>
                        {hasDescription && (
                          isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {project.description && (
                        <p className="text-sm mt-2 pt-2 border-t text-muted-foreground">{project.description}</p>
                      )}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Awards Modal */}
      <Dialog open={activeModal === 'awards'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Awards & Recognition ({awards.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {awards.map((award, index) => {
              const itemId = `award-${award.id || index}`
              const isExpanded = expandedItems.has(itemId)
              const hasDescription = !!award.description
              
              return (
                <Collapsible key={itemId} open={isExpanded} onOpenChange={() => hasDescription && toggleExpanded(itemId)}>
                  <div className="border rounded-lg p-3">
                    <CollapsibleTrigger asChild disabled={!hasDescription}>
                      <div className={`flex items-center justify-between ${hasDescription ? 'cursor-pointer' : ''}`}>
                        <div className="flex-1">
                          <h4 className="font-semibold">{award.title}</h4>
                          {award.year && (
                            <p className="text-sm text-muted-foreground">{award.year}</p>
                          )}
                        </div>
                        {hasDescription && (
                          isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {award.description && (
                        <p className="text-sm mt-2 pt-2 border-t text-muted-foreground">{award.description}</p>
                      )}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Legislation Modal */}
      <Dialog open={activeModal === 'legislation'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-primary" />
              Legislation Authored ({legislation.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {legislation.map((leg, index) => {
              const itemId = `leg-${leg.id || index}`
              const isExpanded = expandedItems.has(itemId)
              const hasDescription = !!leg.description
              
              return (
                <Collapsible key={itemId} open={isExpanded} onOpenChange={() => hasDescription && toggleExpanded(itemId)}>
                  <div className="border rounded-lg p-3">
                    <CollapsibleTrigger asChild disabled={!hasDescription}>
                      <div className={`flex items-center justify-between ${hasDescription ? 'cursor-pointer' : ''}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                              {leg.type}
                            </span>
                            {leg.number && (
                              <span className="text-xs text-muted-foreground">#{leg.number}</span>
                            )}
                            {leg.year && (
                              <span className="text-xs text-muted-foreground">{leg.year}</span>
                            )}
                          </div>
                          <h4 className="font-semibold">{leg.title}</h4>
                        </div>
                        {hasDescription && (
                          isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {leg.description && (
                        <p className="text-sm mt-2 pt-2 border-t text-muted-foreground">{leg.description}</p>
                      )}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Programs Modal */}
      <Dialog open={activeModal === 'programs'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              Programs & Initiatives ({programs.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {programs.map((prog, index) => {
              const itemId = `prog-${prog.id || index}`
              const isExpanded = expandedItems.has(itemId)
              const hasDescription = !!prog.description
              
              return (
                <Collapsible key={itemId} open={isExpanded} onOpenChange={() => hasDescription && toggleExpanded(itemId)}>
                  <div className="border rounded-lg p-3">
                    <CollapsibleTrigger asChild disabled={!hasDescription}>
                      <div className={`flex items-center justify-between ${hasDescription ? 'cursor-pointer' : ''}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              prog.status === 'ONGOING' ? 'bg-green-100 text-green-700' :
                              prog.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {prog.status}
                            </span>
                          </div>
                          <h4 className="font-semibold">{prog.name}</h4>
                        </div>
                        {hasDescription && (
                          isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {prog.description && (
                        <p className="text-sm mt-2 pt-2 border-t text-muted-foreground">{prog.description}</p>
                      )}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Education Modal */}
      <Dialog open={activeModal === 'education'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Education ({education.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {education.map((edu, index) => (
              <div key={edu.id || index} className="border rounded-lg p-3">
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
