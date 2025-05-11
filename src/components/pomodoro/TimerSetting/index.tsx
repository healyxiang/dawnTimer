// src/components/pomodoro/TimerSetting.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TimerPreset } from "@/types/pomodoro";
import { Settings } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEFAULT_PRESETS } from "@/constants/pomodoro";

import {
  getTimerPresets,
  addTimerPreset,
  deleteTimerPreset,
  updateTimerPreset,
} from "@/service/pomodoro";

import { ChangePresetDialog } from "./ChangePresetDialog";
import { EditPresetDialog } from "./EditPresetDialog";
import { AddPresetDialog } from "./AddPresetDialog";

// const TimerSettingMode = {
//   Create: "create",
//   Edit: "edit",
//   Default: "default",
// } as const;

// type TimerSettingModeValue =
//   (typeof TimerSettingMode)[keyof typeof TimerSettingMode];

interface TimerSettingProps {
  disabled: boolean;
  currentPreset: TimerPreset;
  onPresetChange: (preset: TimerPreset) => void;
  // onPresetUpdate: (preset: TimerPreset) => void;
}

export function TimerSetting({
  disabled,
  currentPreset,
  onPresetChange,
}: // onPresetUpdate,
TimerSettingProps) {
  const [presets, setPresets] = useState<TimerPreset[]>(DEFAULT_PRESETS);

  const [isChangeDialogOpen, setIsChangeDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  console.log("currentPreset currentPreset:", currentPreset);
  // 初始化预设
  useEffect(() => {
    const loadPresets = async () => {
      try {
        const savedPresets = await getTimerPresets();
        setPresets(savedPresets);
      } catch (error) {
        console.error("Failed to load timer presets:", error);
        toast.error("Failed to load timer presets");
      }
    };
    loadPresets();
  }, []);

  const handleCreateTimer = async (
    preset: Omit<TimerPreset, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newPreset = await addTimerPreset({
        ...preset,
        id: Date.now().toString(),
      });

      setPresets((prev) => [...prev, newPreset]);
      toast.success("Timer created successfully");
    } catch (error) {
      console.error("Failed to create timer preset:", error);
      toast.error("Failed to create timer");
    }
  };

  const handleDeletePreset = async (presetId: string) => {
    try {
      await deleteTimerPreset(presetId);
      setPresets((prev) => prev.filter((p) => p.id !== presetId));
      toast.success("Preset deleted successfully");
    } catch (error) {
      console.error("Failed to delete preset:", error);
      toast.error("Cannot delete default presets");
    }
  };

  const handlePresetUpdate = async (preset: TimerPreset) => {
    try {
      await updateTimerPreset(preset);
      setPresets((prev) => prev.map((p) => (p.id === preset.id ? preset : p)));
      toast.success("Preset updated successfully");
    } catch (error) {
      console.error("Failed to update preset:", error);
      toast.error("Failed to update preset");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={disabled}>
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setIsChangeDialogOpen(true)}>
              Change Preset
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              Edit Preset
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsAddDialogOpen(true)}>
              Add Preset
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ChangePresetDialog
        isOpen={isChangeDialogOpen}
        onClose={() => setIsChangeDialogOpen(false)}
        presets={presets}
        onPresetChange={onPresetChange}
      />

      <EditPresetDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        currentPreset={currentPreset}
        onPresetUpdate={handlePresetUpdate}
        onDeletePreset={handleDeletePreset}
      />

      <AddPresetDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onPresetAdd={handleCreateTimer}
      />
    </div>
  );
}
