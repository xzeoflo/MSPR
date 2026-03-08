"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { getAuthToken } from "@/lib/auth";
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
  DrawerPortal
} from "@/components/ui/drawer";
import { Trash2 } from "lucide-react";

interface Exercise {
  id: number;
  name: string;
  durationInSeconds: number;
  exerciseType: string;
}

interface SelectedExercise extends Exercise {
  order: number;
}

export function CreateWorkoutViewer({ open, setOpen, onWorkoutCreated }: { open: boolean; setOpen: (open: boolean) => void; onWorkoutCreated?: () => void }) {
  const isMobile = useIsMobile();
  const [availableExercises, setAvailableExercises] = React.useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = React.useState<SelectedExercise[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [workoutType, setWorkoutType] = React.useState<string>("STRENGTH");

  const handleWorkoutTypeChange = (newType: string) => {
    setWorkoutType(newType);
    setSelectedExercises([]);
  };

  React.useEffect(() => {
    if (!open) return;
    const fetchExercises = async () => {
      const token = getAuthToken();
      const res = await fetch("http://localhost:8080/api/v1/exercises", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableExercises(data);
      }
    };
    fetchExercises();
  }, [open]);

  const handleAddExercise = (exerciseId: string) => {
    const ex = availableExercises.find(e => e.id === Number(exerciseId));
    if (ex && !selectedExercises.some(se => se.id === ex.id)) {
      setSelectedExercises(prev => [
        ...prev,
        { ...ex, order: prev.length + 1 }
      ]);
    }
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const token = getAuthToken();

    const workoutPayload = {
      title: formData.get("title"),
      description: formData.get("description"),
      difficulty: formData.get("difficulty"),
      workoutType: workoutType,
      partnerBrand: formData.get("partnerBrand") || null,

      exercises: selectedExercises.map((ex, index) => ({
        ...ex,
        id: null,
        exerciseType: workoutType,
        sequenceOrder: index + 1
      }))
    };

    try {
      const res = await fetch("http://localhost:8080/api/workouts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workoutPayload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Erreur lors de la création");
      }

      setOpen(false);
      setSelectedExercises([]);
      if (onWorkoutCreated) onWorkoutCreated();
    } catch (error: unknown) {
      alert("Erreur Backend: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = availableExercises.filter(
    (ex) => ex.exerciseType?.toUpperCase() === workoutType.toUpperCase()
  );

  return (
    <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
      <DrawerPortal>
        <DrawerContent className={isMobile ? "" : "h-screen top-0 right-0 left-auto mt-0 w-[450px] rounded-none"}>
          <DrawerHeader>
            <DrawerTitle>New Workout</DrawerTitle>
            <DrawerDescription>Create a sequence for {workoutType}.</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
            <form id="create-workout-form" onSubmit={handleCreate} className="flex flex-col gap-6 py-4">

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required placeholder="Full Body Blast" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required placeholder="Describe the workout..." className="resize-none" />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="partnerBrand">Partner Brand</Label>
                  <Input id="partnerBrand" name="partnerBrand" placeholder="ex: BasicFit (Leave empty if none)" />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={workoutType} onValueChange={handleWorkoutTypeChange}>
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
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select name="difficulty" defaultValue="BEGINNER">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                      <SelectItem value="NIGHTMARE">Nightmare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-bold text-primary italic text-xs uppercase tracking-widest">Exercise Sequence</h4>

                <Select onValueChange={handleAddExercise}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Add ${workoutType} exercise`} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredExercises.length > 0 ? (
                      filteredExercises.map(ex => (
                        <SelectItem key={ex.id} value={String(ex.id)}>
                          {ex.name} ({ex.durationInSeconds}s)
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">No matching exercises found.</div>
                    )}
                  </SelectContent>
                </Select>

                <div className="space-y-2 border rounded-lg p-2 bg-muted/30">
                  {selectedExercises.length > 0 ? (
                    selectedExercises.map((ex, idx) => (
                      <div
                        key={`${ex.id}-${idx}`}
                        className="flex items-center justify-between gap-2 bg-background p-2 rounded border shadow-sm group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <span className="font-medium text-xs">
                              {idx + 1}. {ex.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {ex.durationInSeconds}s - {ex.exerciseType}
                            </span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          // Utilisation des classes d'opacité au survol du parent (group)
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive transition-opacity hover:bg-destructive/10"
                          onClick={() => setSelectedExercises(prev => prev.filter((_, i) => i !== idx))}
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
            <Button type="submit" form="create-workout-form" disabled={loading || selectedExercises.length === 0} className="w-full">
              {loading ? "Saving..." : "Create Workout"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
