"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skill } from "@/types/pomodoro";
import { SkillDialog } from "./SkillDialog";

interface SkillManagerProps {
  skills: Skill[];
  onAddSkill: (skill: Omit<Skill, "id" | "createdAt" | "updatedAt">) => void;
  onDeleteSkill: (skillId: string) => void;
}

export function SkillManager({
  skills,
  onAddSkill,
  onDeleteSkill,
}: SkillManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card className="p-4 space-y-4 bg-card/50">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Skills</h2>
        <Button onClick={() => setIsDialogOpen(true)}>Add Skill</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge
            key={skill.id}
            style={{ backgroundColor: skill.color }}
            className="text-sm px-3 py-1"
          >
            {skill.name}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteSkill(skill.id)}
              className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
            >
              ×
            </Button>
          </Badge>
        ))}
      </div>

      <SkillDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={onAddSkill}
      />
    </Card>
  );
}
