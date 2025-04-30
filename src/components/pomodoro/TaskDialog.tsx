"use client";

import { useState } from "react";
import { Task, Skill } from "@/types/pomodoro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    task: Omit<Task, "id" | "pomodoroRatings" | "createdAt" | "updatedAt">
  ) => void;
  skills: Skill[];
}

export function TaskDialog({
  isOpen,
  onClose,
  onSubmit,
  skills,
}: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      completed: false,
      skills: skills.filter((skill) => selectedSkills.includes(skill.id)),
    });
    setTitle("");
    setDescription("");
    setSelectedSkills([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Skills</Label>
            <Select
              value={selectedSkills.join(",")}
              onValueChange={(value) => {
                const newSkills = value.split(",").filter(Boolean);
                setSelectedSkills(newSkills);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select skills" />
              </SelectTrigger>
              <SelectContent>
                {skills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
