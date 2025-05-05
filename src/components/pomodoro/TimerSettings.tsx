"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Plus, Trash2, Pencil } from "lucide-react";
import {
  TimerPreset,
  TimerPresetWithoutNameAndCreatedAt,
} from "@/types/pomodoro";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  getTimerPresets,
  addTimerPreset,
  deleteTimerPreset,
  DEFAULT_PRESETS,
} from "@/service/pomodoro";

interface TimerSettingsProps {
  //   settings: TimerSettingsType;
  preset: TimerPreset;
  onSave: (currentPreset: TimerPresetWithoutNameAndCreatedAt) => void;
  isStopped: boolean;
}

const TimerSettingMode = {
  Create: "create",
  Edit: "edit",
  Default: "default",
} as const;

type TimerSettingModeValue =
  (typeof TimerSettingMode)[keyof typeof TimerSettingMode];

export function TimerSettings({
  preset,
  onSave,
  isStopped,
}: TimerSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timerSettingMode, setTimerSettingMode] =
    useState<TimerSettingModeValue>(TimerSettingMode.Default);
  const [localSettings, setLocalSettings] = useState(preset.settings);
  const [presets, setPresets] = useState<TimerPreset[]>(DEFAULT_PRESETS);
  const [selectedPreset, setSelectedPreset] = useState<string>(preset.id);
  const [timerName, setTimerName] = useState("");

  const isDefaultMode = timerSettingMode === TimerSettingMode.Default;
  const isDisabledPreset =
    !selectedPreset ||
    selectedPreset === "classic" ||
    selectedPreset === "short";

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

  const handleSave = () => {
    onSave({
      id: selectedPreset,
      settings: localSettings,
      updatedAt: new Date(),
    });
    setIsOpen(false);
  };

  const handleEditPreset = () => {
    setTimerSettingMode(
      timerSettingMode === TimerSettingMode.Default
        ? TimerSettingMode.Edit
        : TimerSettingMode.Default
    );
  };

  const handleDeletePreset = async (presetId: string) => {
    try {
      await deleteTimerPreset(presetId);
      setPresets((prev) => prev.filter((p) => p.id !== presetId));
      setSelectedPreset(presets[0].id);
      toast.success("Preset deleted successfully");
    } catch (error) {
      console.error("Failed to delete preset:", error);
      toast.error("Cannot delete default presets");
    }
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setLocalSettings(preset.settings);
      setSelectedPreset(presetId);
    }
  };

  const handleCreateTimer = async () => {
    if (!timerName.trim()) {
      toast.error("Please enter a timer name");
      return;
    }

    try {
      const newPreset = await addTimerPreset({
        id: Date.now().toString(),
        name: timerName.trim(),
        settings: localSettings,
      });

      setPresets((prev) => [...prev, newPreset]);
      //   onSave(localSettings);
      setSelectedPreset(newPreset.id);
      setTimerSettingMode(TimerSettingMode.Default);
      setTimerName("");
      toast.success("Timer created successfully");
    } catch (error) {
      console.error("Failed to create timer preset:", error);
      toast.error("Failed to create timer");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          disabled={!isStopped}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {timerSettingMode === TimerSettingMode.Create
              ? "Timer Create"
              : "Timer Settings"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {timerSettingMode !== TimerSettingMode.Create ? (
            <>
              <div className="space-y-2">
                <Label>Presets</Label>
                <div className="flex gap-2">
                  <div className="w-full">
                    <Select
                      defaultValue={selectedPreset}
                      value={selectedPreset}
                      onValueChange={handlePresetSelect}
                    >
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select a preset..." />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {presets.map((preset) => (
                          <SelectItem
                            className="w-full cursor-pointer"
                            key={preset.id}
                            value={preset.id}
                          >
                            {preset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={isDisabledPreset}
                    onClick={handleEditPreset}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      selectedPreset && handleDeletePreset(selectedPreset)
                    }
                    disabled={isDisabledPreset}
                    className="hover:text-destructive disabled:hover:bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 text-destructive disabled:text-muted-foreground" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pomodoroLength">
                  Pomodoro Duration (minutes)
                </Label>
                <Input
                  id="pomodoroLength"
                  type="number"
                  min="1"
                  max="60"
                  disabled={isDefaultMode}
                  value={localSettings.pomodoroLength / 60}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      pomodoroLength:
                        Math.max(1, Math.min(60, Number(e.target.value))) * 60,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortBreakLength">
                  Short Break Duration (minutes)
                </Label>
                <Input
                  id="shortBreakLength"
                  type="number"
                  min="1"
                  max="30"
                  disabled={isDefaultMode}
                  value={localSettings.shortBreakLength / 60}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      shortBreakLength:
                        Math.max(1, Math.min(30, Number(e.target.value))) * 60,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longBreakLength">
                  Long Break Duration (minutes)
                </Label>
                <Input
                  id="longBreakLength"
                  type="number"
                  min="1"
                  max="60"
                  disabled={isDefaultMode}
                  value={localSettings.longBreakLength / 60}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      longBreakLength:
                        Math.max(1, Math.min(60, Number(e.target.value))) * 60,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longBreakInterval">
                  Pomodoros until Long Break
                </Label>
                <Input
                  id="longBreakInterval"
                  type="number"
                  min="1"
                  max="10"
                  disabled={isDefaultMode}
                  value={localSettings.longBreakInterval}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      longBreakInterval: Math.max(
                        1,
                        Math.min(10, Number(e.target.value))
                      ),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => setTimerSettingMode(TimerSettingMode.Create)}
                >
                  <Plus className="h-4 w-4" />
                  Create Timer
                </Button>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Settings</Button>
              </div>
            </>
          ) : (
            <>
              {/* 创建Timer */}
              <div className="space-y-2">
                <Label htmlFor="timerName">Timer Name</Label>
                <Input
                  id="timerName"
                  value={timerName}
                  onChange={(e) => setTimerName(e.target.value)}
                  placeholder="Enter timer name..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pomodoroLength">Focus Duration (minutes)</Label>
                <Input
                  id="pomodoroLength"
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.pomodoroLength / 60}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      pomodoroLength:
                        Math.max(1, Math.min(60, Number(e.target.value))) * 60,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortBreakLength">
                  Short Break Duration (minutes)
                </Label>
                <Input
                  id="shortBreakLength"
                  type="number"
                  min="1"
                  max="30"
                  value={localSettings.shortBreakLength / 60}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      shortBreakLength:
                        Math.max(1, Math.min(30, Number(e.target.value))) * 60,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longBreakLength">
                  Long Break Duration (minutes)
                </Label>
                <Input
                  id="longBreakLength"
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.longBreakLength / 60}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      longBreakLength:
                        Math.max(1, Math.min(60, Number(e.target.value))) * 60,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longBreakInterval">
                  Focus Sessions until Long Break
                </Label>
                <Input
                  id="longBreakInterval"
                  type="number"
                  min="1"
                  max="10"
                  value={localSettings.longBreakInterval}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      longBreakInterval: Math.max(
                        1,
                        Math.min(10, Number(e.target.value))
                      ),
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTimerSettingMode(TimerSettingMode.Default);
                    setTimerName("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateTimer}>Create</Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
