"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { getSkills } from "@/service/pomodoro";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skill } from "@/types/pomodoro";
import { SkillDialog } from "./SkillDialog";

import { addSkill, deleteSkill } from "@/service/pomodoro";

interface SkillManagerProps {
  skills: Skill[];
}

export function SkillManager({ skills: initialSkills }: SkillManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  console.log("skills skills----- skills:", skills);
  // const handleAddSkill = async (
  //   skill: Omit<Skill, "id" | "createdAt" | "updatedAt">
  // ) => {
  //   await addSkill(skill);
  //   setIsDialogOpen(false);
  // };

  // const handleDeleteSkill = async (skillId: string) => {
  //   await deleteSkill(skillId);
  // };

  const handleAddSkill = async (
    skill: Omit<Skill, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newSkill = await addSkill(skill);
      setSkills((prev) => [...prev, newSkill]);
      toast.success("Skill added successfully");
    } catch (error) {
      toast.error("Failed to add skill");
      console.error("Error adding skill:", error);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      await deleteSkill(skillId);
      setSkills((prev) => prev.filter((skill) => skill.id !== skillId));
      toast.success("Skill deleted successfully");
    } catch (error) {
      toast.error("Failed to delete skill");
      console.error("Error deleting skill:", error);
    }
  };

  useEffect(() => {
    if (initialSkills.length === 0) {
      const fetchSkills = async () => {
        const skills = await getSkills();
        setSkills(skills);
      };
      fetchSkills();
    }
  }, [initialSkills.length]);

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
            style={{ backgroundColor: skill.color || "gray" }}
            className="text-sm px-3 py-1"
          >
            {skill.name}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteSkill(skill.id)}
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
        onSubmit={handleAddSkill}
      />
    </Card>
  );
}
