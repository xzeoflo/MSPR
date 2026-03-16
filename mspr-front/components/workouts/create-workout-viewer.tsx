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
import { Trash2, Clock } from "lucide-react";

type Intensity = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

interface Exercise {
  id: number;
  name: string;
  description: string;
  durationInSeconds: number;
  caloriesBurned: number;
  exerciseType: string;
  intensityLevel: Intensity;
  sets: number;
  repetitions: number;
}

interface SelectedExercise extends Exercise {
  sequenceOrder: number;
}

export function CreateWorkoutViewer({ open, setOpen, onWorkoutCreated }: { open: boolean; setOpen: (open: boolean) => void; onWorkoutCreated?: () => void }) {
  const isMobile = useIsMobile();
  const [availableExercises, setAvailableExercises] = React.useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = React.useState<SelectedExercise[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [workoutType, setWorkoutType] = React.useState<string>("STRENGTH");
  const [difficulty, setDifficulty] = React.useState<Intensity>("BEGINNER");

  const handleWorkoutTypeChange = (newType: string) => {
    setWorkoutType(newType);
    setSelectedExercises([]);
  };

  React.useEffect(() => {
    if (!open) return;
    const fetchExercises = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch("http://localhost:8080/api/exercises", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAvailableExercises(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchExercises();
  }, [open]);

  const handleAddExercise = (exerciseId: string) => {
    const ex = availableExercises.find(e => e.id === Number(exerciseId));
    if (ex) {
      setSelectedExercises(prev => [
        ...prev,
        { ...ex, sequenceOrder: prev.length + 1 }
      ]);
    }
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const token = getAuthToken();

    const totalDuration = selectedExercises.reduce((sum, ex) => sum + (ex.durationInSeconds || 0), 0);
    const totalCalories = selectedExercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);

    const workoutPayload = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      difficulty: difficulty,
      workoutType: workoutType,
      partnerBrand: (formData.get("partnerBrand") as string) || null,
      totalDuration: totalDuration,
      totalCalories: totalCalories,
      exercises: selectedExercises.map((ex, index) => ({
        name: ex.name,
        description: ex.description || "No description",
        durationInSeconds: ex.durationInSeconds || 0,
        repetitions: ex.repetitions || 0,
        sets: ex.sets || 0,
        caloriesBurned: ex.caloriesBurned || 0,
        exerciseType: workoutType,
        intensityLevel: (ex.intensityLevel || "INTERMEDIATE").toUpperCase(),
        sequenceOrder: index + 1,
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
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur ${res.status}: Requête invalide`);
      }

      setOpen(false);
      setSelectedExercises([]);
      if (onWorkoutCreated) onWorkoutCreated();
    } catch (error: any) {
      console.error("Create Error:", error);
      alert("Erreur: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = availableExercises.filter(
    (ex) => ex.exerciseType?.toUpperCase() === workoutType.toUpperCase()
  );

  const totalTimeSeconds = selectedExercises.reduce((sum, ex) => sum + ex.durationInSeconds, 0);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
      <DrawerPortal>
        <DrawerContent className={isMobile ? "" : "h-screen top-0 right-0 left-auto mt-0 w-[450px] rounded-none"}>
          <DrawerHeader>
            <DrawerTitle>New Workout</DrawerTitle>
            <DrawerDescription>Create a sequence for {workoutType}.</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm flex-1">
            <form id="create-workout-form" onSubmit={handleCreate} className="flex flex-col gap-6 py-4">

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required placeholder="Full Body Blast" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required placeholder="Describe the workout..." className="min-h-[80px] resize-none" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerBrand">Partner Brand</Label>
                  <Input id="partnerBrand" name="partnerBrand" placeholder="ex: BasicFit" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={workoutType} onValueChange={handleWorkoutTypeChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STRENGTH">Strength</SelectItem>
                      <SelectItem value="CARDIO">Cardio</SelectItem>
                      <SelectItem value="STRONGMAN">Strongman</SelectItem>
                      <SelectItem value="STRETCHING">Stretching</SelectItem>
                      <SelectItem value="POWERLIFTING">Powerlifting</SelectItem>
                      <SelectItem value="PLYOMETRICS">Plyometrics</SelectItem>
                      <SelectItem value="OLYMPIC_WEIGHTLIFTING">Olympic Weightlifting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={difficulty}
                    onValueChange={(val: Intensity) => setDifficulty(val)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-primary text-xs uppercase tracking-widest">Exercise Sequence</h4>
                  <div className="flex items-center gap-1 text-[10px] bg-secondary px-2 py-0.5 rounded">
                    <Clock className="h-3 w-3" />
                    {Math.floor(totalTimeSeconds / 60)}m {totalTimeSeconds % 60}s
                  </div>
                </div>

                <Select onValueChange={handleAddExercise}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Add ${workoutType.toLowerCase()} exercise...`} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredExercises.map(ex => (
                      <SelectItem key={ex.id} value={String(ex.id)}>
                        {ex.name} ({ex.durationInSeconds}s)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="space-y-2 border rounded-lg p-2 bg-muted/30">
                  {selectedExercises.length > 0 ? (
                    selectedExercises.map((ex, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 bg-background p-2 rounded border shadow-sm group">
                        <div className="flex flex-col">
                          <span className="font-medium text-xs">{idx + 1}. {ex.name}</span>
                          <span className="text-[10px] text-muted-foreground">{ex.durationInSeconds}s</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                          onClick={() => setSelectedExercises(prev => prev.filter((_, i) => i !== idx))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-muted-foreground text-xs italic">No exercises added.</p>
                  )}
                </div>
              </div>
            </form>
          </div>

          <DrawerFooter className="border-t bg-background">
            <Button type="submit" form="create-workout-form" disabled={loading || selectedExercises.length === 0}>
              {loading ? "Creating..." : "Create Workout"}
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
