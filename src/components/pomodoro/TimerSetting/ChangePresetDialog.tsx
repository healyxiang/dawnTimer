// src/components/pomodoro/TimerSetting/ChangePresetDialog.tsx
"use client";

import { useState } from "react";
import { TimerPreset } from "@/types/pomodoro";
import { Button } from "@/components/ui/button";
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

interface ChangePresetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  presets: TimerPreset[];
  onPresetChange: (preset: TimerPreset) => void;
}

export function ChangePresetDialog({
  isOpen,
  onClose,
  presets,
  onPresetChange,
}: ChangePresetDialogProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");

  const handleSubmit = () => {
    const selectedPreset = presets.find((p) => p.id === selectedPresetId);
    if (selectedPreset) {
      onPresetChange(selectedPreset);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Preset</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={selectedPresetId} onValueChange={setSelectedPresetId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a preset" />
            </SelectTrigger>
            <SelectContent>
              {presets.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Change</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
