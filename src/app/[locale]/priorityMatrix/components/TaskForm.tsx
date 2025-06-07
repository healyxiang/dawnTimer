"use client";

import { useState } from "react";
import { Task, Quadrant, Priority } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  initialData?: Partial<Task>;
  trigger?: React.ReactNode;
}

export const TaskForm = ({ onSubmit, initialData, trigger }: TaskFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    quadrant: "urgent-important",
    priority: "medium",
    completed: false,
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Omit<Task, "id" | "createdAt" | "updatedAt">);
    setOpen(false);
    setFormData({
      title: "",
      description: "",
      quadrant: "urgent-important",
      priority: "medium",
      completed: false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>添加任务</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "编辑任务" : "添加任务"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">标题</label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="输入任务标题"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">描述</label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="输入任务描述"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">象限</label>
            <Select
              value={formData.quadrant}
              onValueChange={(value: Quadrant) =>
                setFormData({ ...formData, quadrant: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择象限" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent-important">紧急且重要</SelectItem>
                <SelectItem value="not-urgent-important">
                  不紧急但重要
                </SelectItem>
                <SelectItem value="urgent-not-important">
                  紧急但不重要
                </SelectItem>
                <SelectItem value="not-urgent-not-important">
                  不紧急且不重要
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">优先级</label>
            <Select
              value={formData.priority}
              onValueChange={(value: Priority) =>
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择优先级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">截止日期</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? (
                    format(formData.dueDate, "PPP")
                  ) : (
                    <span>选择日期</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) =>
                    setFormData({ ...formData, dueDate: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full">
            {initialData ? "保存更改" : "添加任务"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
