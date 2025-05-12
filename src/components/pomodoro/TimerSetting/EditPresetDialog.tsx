// src/components/pomodoro/TimerSetting/EditPresetDialog.tsx
"use client";

import { useEffect, useState } from "react";
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

interface EditPresetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPreset: TimerPreset;
  onDeletePreset: (presetId: string) => void;
  onPresetUpdate: (preset: TimerPreset) => void;
}

export function EditPresetDialog({
  isOpen,
  onClose,
  currentPreset,
  //   onDeletePreset,
  onPresetUpdate,
}: EditPresetDialogProps) {
  const [name, setName] = useState(currentPreset.name);
  const [pomodoroLength, setPomodoroLength] = useState(
    currentPreset.pomodoroLength / 60
  );
  const [shortBreakLength, setShortBreakLength] = useState(
    currentPreset.shortBreakLength / 60
  );
  const [longBreakLength, setLongBreakLength] = useState(
    currentPreset.longBreakLength / 60
  );
  const [longBreakInterval, setLongBreakInterval] = useState(
    currentPreset.longBreakInterval
  );

  const handleSubmit = () => {
    onPresetUpdate({
      ...currentPreset,
      name,
      pomodoroLength: pomodoroLength * 60,
      shortBreakLength: shortBreakLength * 60,
      longBreakLength: longBreakLength * 60,
      longBreakInterval,
    });
    onClose();
  };

  useEffect(() => {
    setName(currentPreset.name);
    setPomodoroLength(currentPreset.pomodoroLength / 60);
    setShortBreakLength(currentPreset.shortBreakLength / 60);
    setLongBreakLength(currentPreset.longBreakLength / 60);
    setLongBreakInterval(currentPreset.longBreakInterval);
  }, [currentPreset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Pomodoro Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter preset name"
            />
          </div> */}
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
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
