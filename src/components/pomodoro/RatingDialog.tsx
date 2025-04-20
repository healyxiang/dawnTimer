"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rating } from "@/types/pomodoro";
import { Star } from "lucide-react";

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ratings: {
    focus: Rating;
    completion: Rating;
    satisfaction: Rating;
  }) => void;
}

export function RatingDialog({ isOpen, onClose, onSubmit }: RatingDialogProps) {
  const [focus, setFocus] = useState<Rating>(3);
  const [completion, setCompletion] = useState<Rating>(3);
  const [satisfaction, setSatisfaction] = useState<Rating>(3);

  const handleSubmit = () => {
    onSubmit({ focus, completion, satisfaction });
    onClose();
  };

  const RatingStars = ({
    value,
    onChange,
  }: {
    value: Rating;
    onChange: (rating: Rating) => void;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star as Rating)}
          className="focus:outline-none"
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className={`w-6 h-6 ${
              star <= value
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate Your Pomodoro Session</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Focus Level</label>
            <RatingStars value={focus} onChange={setFocus} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Task Completion</label>
            <RatingStars value={completion} onChange={setCompletion} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Overall Satisfaction</label>
            <RatingStars value={satisfaction} onChange={setSatisfaction} />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Rating</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
