"use client";

import { useState } from "react";
import { Skill } from "@/types/pomodoro";
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

interface SkillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    skill: Omit<Skill, "id" | "createdAt" | "updatedAt" | "description">
  ) => void;
}

export function SkillDialog({ isOpen, onClose, onSubmit }: SkillDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      color: color.trim() || "#3b82f6",
    });
    setName("");
    setColor("#3b82f6");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter skill name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-20 h-10 p-1"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1"
                placeholder="#3b82f6"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Skill</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
