"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getAuthToken } from "@/lib/auth";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge"; // Import des badges
import { IconPlus, IconX, IconBarbell } from "@tabler/icons-react"; // Import des icônes
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
  { label: "Strongman", value: "STRONGMAN" },
  { label: "Stretching", value: "STRETCHING" },
  { label: "Powerlifting", value: "POWERLIFTING" },
  { label: "Plyometrics", value: "PLYOMETRICS" },
  { label: "Olympic Weightlifting", value: "OLYMPIC WEIGHTLIFTING" },
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

  // ÉTATS POUR LES ÉQUIPEMENTS
  const [equipments, setEquipments] = React.useState<string[]>([]);
  const [equipmentInput, setEquipmentInput] = React.useState("");

  // On reset les champs quand le drawer s'ouvre/ferme
  React.useEffect(() => {
    if (!open) {
      setEquipments([]);
      setEquipmentInput("");
    }
  }, [open]);

  const addEquipment = () => {
    const val = equipmentInput.trim();
    if (val && !equipments.includes(val)) {
      setEquipments([...equipments, val]);
      setEquipmentInput("");
    }
  };

  const removeEquipment = (name: string) => {
    setEquipments(equipments.filter(e => e !== name));
  };

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
      exerciseEquipments: equipments.length > 0 ? equipments : ["None"], // Ajout des équipements
      sequenceOrder: 0,
      workout: null,
    };

    const token = getAuthToken();

    try {
      const response = await fetch("http://localhost:8080/api/exercises", {
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

          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm flex-1">
            {!isMobile && <Separator className="my-2" />}

            <form id="create-exercise-form" onSubmit={handleCreate} className="flex flex-col gap-6 py-4">
              {/* identity Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary italic">General Info</h4>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-xs font-semibold uppercase text-muted-foreground">Exercise Name</Label>
                  <Input id="name" name="name" placeholder="e.g. Bench Press" required />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="exerciseType" className="text-xs font-semibold uppercase text-muted-foreground">Type</Label>
                  <Select name="exerciseType" defaultValue="STRENGTH" required>
                    <SelectTrigger id="exerciseType">
                      <SelectValue placeholder="Select exercise type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXERCISE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
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

              {/* SECTION EQUIPMENTS AJOUTÉE */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-primary italic">Equipment Required</h4>
                  <IconBarbell size={18} className="text-muted-foreground" />
                </div>

                <div className="flex flex-wrap gap-2 min-h-[20px]">
                  {equipments.map((eq) => (
                    <Badge key={eq} variant="secondary" className="pl-2 pr-1 py-1 gap-1 bg-zinc-900 border-zinc-800 text-zinc-300">
                      {eq}
                      <button
                        type="button"
                        onClick={() => removeEquipment(eq)}
                        className="rounded-full hover:bg-zinc-800 p-0.5 transition-colors"
                      >
                        <IconX size={12} />
                      </button>
                    </Badge>
                  ))}
                  {equipments.length === 0 && (
                    <span className="text-zinc-500 italic text-xs">Bodyweight (No equipment)</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add: Barbell, Bench, etc."
                    value={equipmentInput}
                    onChange={(e) => setEquipmentInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addEquipment();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addEquipment}>
                    <IconPlus size={18} />
                  </Button>
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
                          <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
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
