"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getAuthToken } from "@/lib/auth";
import { Textarea } from "@/components/ui/textarea";
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

const EXERCISE_TYPES = [
  { label: "Cardio", value: "CARDIO" },
  { label: "Strength", value: "STRENGTH" },
  { label: "Flexibility", value: "FLEXIBILITY" },
  { label: "Hiit", value: "HIIT" },
  { label: "Core", value: "CORE" },
];
const INTENSITY_LEVELS = [
  { label: "Beginner", value: "BEGINNER" },
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Advanced", value: "ADVANCED" },
  { label: "Nightmare", value: "NIGHTMARE" },
];

interface CreateExerciseViewerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onExerciseCreated?: () => void;
}

export function CreateExerciseViewer({ open, setOpen, onExerciseCreated }: CreateExerciseViewerProps) {
  const isMobile = useIsMobile();

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    const payload = {
      ...rawData,
      durationInSeconds: parseInt(rawData.durationInSeconds as string) || 0,
      repetitions: parseInt(rawData.repetitions as string) || 0,
      sets: parseInt(rawData.sets as string) || 0,
      caloriesBurned: parseInt(rawData.caloriesBurned as string) || 0,
      sequenceOrder: 0,
      workout: null, // Pour éviter le NullPointerException que tu avais
    };

    const token = getAuthToken();

    try {
      const response = await fetch("http://localhost:8080/api/v1/exercises", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setOpen(false);
        if (onExerciseCreated) onExerciseCreated();
      } else {
        const errorData = await response.text();
        alert("Failed to create exercise: " + errorData);
      }
    } catch (error) {
      alert("Error creating exercise: " + error);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
      <DrawerPortal>
        <DrawerContent
          className={isMobile ? "" : "h-screen top-0 right-0 left-auto mt-0 w-[500px] rounded-none"}
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <DrawerHeader className="gap-1">
            <DrawerTitle>Create New Exercise</DrawerTitle>
            <DrawerDescription>
              Define the movement details, intensity, and targets.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
            {!isMobile && <Separator className="my-2" />}

            <form id="create-exercise-form" onSubmit={handleCreate} className="flex flex-col gap-6 py-4">
              {/* identity Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary italic">General Info</h4>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-xs font-semibold uppercase text-muted-foreground">Exercise Name</Label>
                  <Input id="name" name="name" placeholder="e.g. Bench Press" required />
                </div>

                {/* REMPLACEMENT DE L'INPUT PAR UN SELECT POUR LE TYPE */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="exerciseType" className="text-xs font-semibold uppercase text-muted-foreground">Type</Label>
                  <Select name="exerciseType" defaultValue="STRENGTH" required>
                    <SelectTrigger id="exerciseType">
                      <SelectValue placeholder="Select exercise type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXERCISE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="description" className="text-xs font-semibold uppercase text-muted-foreground">Description</Label>
                  <Textarea id="description" name="description" placeholder="Describe the movement..." className="min-h-[80px]" required />
                </div>
              </div>

              <Separator />

              {/* technical Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary italic">Technical Specs</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="intensityLevel" className="text-xs font-semibold uppercase text-muted-foreground">Intensity</Label>
                    <Select name="intensityLevel" defaultValue="BEGINNER" required>
                      <SelectTrigger id="intensityLevel"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {INTENSITY_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="durationInSeconds" className="text-xs font-semibold uppercase text-muted-foreground">Duration (sec)</Label>
                    <Input id="durationInSeconds" name="durationInSeconds" type="number" defaultValue="60" required />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="sets" className="text-xs font-semibold uppercase text-muted-foreground">Sets</Label>
                    <Input id="sets" name="sets" type="number" defaultValue="3" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="repetitions" className="text-xs font-semibold uppercase text-muted-foreground">Reps</Label>
                    <Input id="repetitions" name="repetitions" type="number" defaultValue="12" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="caloriesBurned" className="text-xs font-semibold uppercase text-muted-foreground">Kcal</Label>
                    <Input id="caloriesBurned" name="caloriesBurned" type="number" defaultValue="50" required />
                  </div>
                </div>
              </div>
            </form>
          </div>

          <DrawerFooter className="pt-4 border-t">
            <Button type="submit" form="create-exercise-form">Save Exercise</Button>
            <DrawerClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
