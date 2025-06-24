"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Task, Skill } from "@/types/pomodoro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { QUADRANT_TITLES } from "@/constants/common";

// 表单验证模式
const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  skillIds: z.array(z.string()).optional(),
  quadrant: z.enum(["q1", "q2", "q3", "q4"] as const),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    task: Omit<Task, "pomodoroRatings" | "createdAt" | "updatedAt" | "id"> & {
      id?: string;
    }
  ) => void;
  skills: Skill[];
  task?: Task; // Optional task for editing
}

export function TaskDialog({
  isOpen,
  onClose,
  onSubmit,
  skills,
  task,
}: TaskDialogProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      skillIds: [],
      quadrant: "q1",
    },
  });

  // 当任务数据变化时，更新表单值
  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || "",
        skillIds: task.skillIds || [],
        quadrant: task.quadrant,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        skillIds: [],
        quadrant: "q1",
      });
    }
  }, [task, form]);

  const handleSubmit = (values: TaskFormValues) => {
    const taskData = {
      title: values.title.trim(),
      description: values.description?.trim() || null,
      completed: task?.completed || false,
      skillIds: values.skillIds || [],
      quadrant: values.quadrant,
    };

    // 只有在编辑现有任务时才包含 id
    if (task?.id) {
      onSubmit({
        ...taskData,
        id: task.id,
      });
    } else {
      onSubmit(taskData); // 创建新任务时不传 id
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md dark:bg-gray-900 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-100">
            {task ? "Edit Task" : "Add New Task"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-200">
                    Task Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter task title"
                      {...field}
                      className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-200">
                    Task Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter task description (optional)"
                      {...field}
                      className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skillIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-200">
                    Related Skills
                  </FormLabel>
                  <Select
                    value={field.value?.join(",") || ""}
                    onValueChange={(value) => {
                      const newSkills = value.split(",").filter(Boolean);
                      field.onChange(newSkills);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                        <SelectValue placeholder="Select related skills" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      {skills.map((skill) => (
                        <SelectItem
                          key={skill.id}
                          value={skill.id}
                          className="dark:text-gray-100 dark:hover:bg-gray-700"
                        >
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quadrant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-200">
                    Priority Quadrant
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                        <SelectValue placeholder="Select task priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      {Object.entries(QUADRANT_TITLES).map(([key, value]) => (
                        <SelectItem
                          key={key}
                          value={key}
                          className="dark:text-gray-100 dark:hover:bg-gray-700"
                        >
                          {value.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button type="submit">
                {task ? "Save Changes" : "Add Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
