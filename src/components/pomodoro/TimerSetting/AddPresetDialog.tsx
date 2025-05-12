// src/components/pomodoro/TimerSetting/AddPresetDialog.tsx
"use client";

import { useState } from "react";
import { TimerPreset } from "@/types/pomodoro";
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

interface AddPresetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPresetAdd: (
    preset: Omit<TimerPreset, "id" | "createdAt" | "updatedAt">
  ) => void;
}

export function AddPresetDialog({
  isOpen,
  onClose,
  onPresetAdd,
}: AddPresetDialogProps) {
  const [name, setName] = useState("");
  const [pomodoroLength, setPomodoroLength] = useState(25);
  const [shortBreakLength, setShortBreakLength] = useState(5);
  const [longBreakLength, setLongBreakLength] = useState(15);
  const [longBreakInterval, setLongBreakInterval] = useState(4);

  const handleSubmit = () => {
    onPresetAdd({
      name: name.trim(),
      pomodoroLength: pomodoroLength * 60,
      shortBreakLength: shortBreakLength * 60,
      longBreakLength: longBreakLength * 60,
      longBreakInterval,
      autoStartBreaks: false,
      autoStartPomodoros: false,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Preset</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter preset name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pomodoroLength">Pomodoro Length (minutes)</Label>
            <Input
              id="pomodoroLength"
              type="number"
              value={pomodoroLength}
              onChange={(e) => setPomodoroLength(Number(e.target.value))}
              min="1"
              max="60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortBreakLength">
              Short Break Length (minutes)
            </Label>
            <Input
              id="shortBreakLength"
              type="number"
              value={shortBreakLength}
              onChange={(e) => setShortBreakLength(Number(e.target.value))}
              min="1"
              max="30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longBreakLength">Long Break Length (minutes)</Label>
            <Input
              id="longBreakLength"
              type="number"
              value={longBreakLength}
              onChange={(e) => setLongBreakLength(Number(e.target.value))}
              min="1"
              max="60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longBreakInterval">
              Pomodoros until Long Break
            </Label>
            <Input
              id="longBreakInterval"
              type="number"
              value={longBreakInterval}
              onChange={(e) => setLongBreakInterval(Number(e.target.value))}
              min="1"
              max="10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Preset</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
