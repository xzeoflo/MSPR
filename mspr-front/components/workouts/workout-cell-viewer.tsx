"use client";

import * as React from "react";
import { Workout } from "@/types/workout";
import { Exercise } from "@/types/exercise";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { getAuthToken } from "@/lib/auth";
import { Trash2, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerPortal
} from "@/components/ui/drawer";

interface WorkoutCellViewerProps {
  item: Workout;
  onWorkoutUpdated?: () => void;
}

export function WorkoutCellViewer({ item, onWorkoutUpdated }: WorkoutCellViewerProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [availableExercises, setAvailableExercises] = React.useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = React.useState<Exercise[]>(item.exercises || []);
  const [workoutType, setWorkoutType] = React.useState<string>(item.workoutType);

  React.useEffect(() => {
    if (!isOpen) return;

    const fetchExercises = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch("http://localhost:8080/api/v1/exercises", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAvailableExercises(data);
        }
      } catch (err) {
        console.error("Failed to fetch exercises", err);
      }
    };

    fetchExercises();
    setSelectedExercises(item.exercises || []);
    setWorkoutType(item.workoutType);
  }, [isOpen, item]);

  const handleAddExercise = (exerciseId: string) => {
    const ex = availableExercises.find(e => e.id === Number(exerciseId));
    if (ex) {
      setSelectedExercises(prev => [
        ...prev,
        {
          ...ex,
          id: undefined,
          sequenceOrder: prev.length + 1
        }
      ]);
    }
  };

  const handleRemoveExercise = (idx: number) => {
    setSelectedExercises(prev =>
      prev.filter((_, i) => i !== idx).map((ex, i) => ({ ...ex, sequenceOrder: i + 1 }))
    );
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const token = getAuthToken();

    const payload = {
      ...item,
      title: formData.get("title"),
      description: formData.get("description"),
      difficulty: formData.get("difficulty"),
      workoutType: workoutType,
      partnerBrand: formData.get("partnerBrand") || null,
      exercises: selectedExercises.map((ex, index) => ({
        ...ex,
        id: ex.id || null,
        sequenceOrder: index + 1,
        exerciseType: workoutType,
      }))
    };

    try {
      const res = await fetch(`http://localhost:8080/api/workouts/${item.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed on server");

      setIsOpen(false);

      if (onWorkoutUpdated) {
        onWorkoutUpdated();
      }

      router.refresh();

    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating workout. Please check your network or server logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left font-medium">
          {item.title}
        </Button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerContent className={isMobile ? "" : "h-screen top-0 right-0 left-auto mt-0 w-[450px] rounded-none"}>
          <DrawerHeader>
            <DrawerTitle>Edit Workout</DrawerTitle>
            <DrawerDescription>Modify parameters and exercise sequence.</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm flex-1">
            <form id="edit-workout-form" onSubmit={handleUpdate} noValidate className="flex flex-col gap-6 py-4">

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest">General Info</h4>
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" defaultValue={item.title} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={item.description}
                    className="min-h-[80px] resize-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select name="difficulty" defaultValue={item.difficulty}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                      <SelectItem value="NIGHTMARE">Nightmare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={workoutType} onValueChange={setWorkoutType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STRENGTH">Strength</SelectItem>
                      <SelectItem value="CARDIO">Cardio</SelectItem>
                      <SelectItem value="HIIT">HIIT</SelectItem>
                      <SelectItem value="CORE">Core</SelectItem>
                      <SelectItem value="FLEXIBILITY">Flexibility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnerBrand">Partner Brand</Label>
                <Input id="partnerBrand" name="partnerBrand" defaultValue={item.partnerBrand || ""} />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Exercises Sequence</h4>

                <div className="flex gap-2">
                  <Select onValueChange={handleAddExercise}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Add exercise..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableExercises
                        .filter(ex => ex.exerciseType === workoutType)
                        .map(ex => (
                          <SelectItem key={ex.id} value={String(ex.id)}>
                            {ex.name} ({ex.durationInSeconds}s)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 border rounded-lg p-2 bg-muted/30">
                  {selectedExercises.length > 0 ? (
                    selectedExercises.map((ex, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 bg-background p-2 rounded border shadow-sm group">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <span className="font-medium text-xs">{idx + 1}. {ex.name}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {ex.durationInSeconds}s - {ex.intensityLevel}
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive transition-opacity"
                          onClick={() => handleRemoveExercise(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-muted-foreground text-xs italic">
                      No exercises in this workout.
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>

          <DrawerFooter className="border-t bg-background">
            <Button type="submit" form="edit-workout-form" disabled={loading}>
              {loading ? "Updating..." : "Update Workout"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
