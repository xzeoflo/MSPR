"use client";

import * as React from "react";
import { Exercise } from "@/types/exercise";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { getAuthToken } from "@/lib/auth";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { IconPlus, IconX, IconBarbell } from "@tabler/icons-react";
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
];

interface ExerciseCellViewerProps {
  item: Exercise;
  onExerciseUpdated?: () => void;
}

export function ExerciseCellViewer({ item, onExerciseUpdated }: ExerciseCellViewerProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Gestion locale des équipements pour l'édition
  const [equipments, setEquipments] = React.useState<string[]>(item.exerciseEquipments || []);
  const [equipmentInput, setEquipmentInput] = React.useState("");

  // On reset l'état local quand l'item change ou que le drawer s'ouvre
  React.useEffect(() => {
    if (isOpen) {
      setEquipments(item.exerciseEquipments || []);
    }
  }, [isOpen, item.exerciseEquipments]);

  const addEquipment = () => {
    const val = equipmentInput.trim();
    if (val && !equipments.includes(val)) {
      setEquipments([...equipments.filter(e => e !== "None"), val]);
      setEquipmentInput("");
    }
  };

  const removeEquipment = (name: string) => {
    const next = equipments.filter(e => e !== name);
    setEquipments(next.length === 0 ? ["None"] : next);
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const rawData = Object.fromEntries(formData.entries());
    const token = getAuthToken();

    const payload = {
      ...item,
      name: rawData.name,
      description: rawData.description,
      exerciseType: rawData.exerciseType,
      intensityLevel: rawData.intensityLevel,
      durationInSeconds: parseInt(rawData.durationInSeconds as string) || 0,
      repetitions: parseInt(rawData.repetitions as string) || 0,
      sets: parseInt(rawData.sets as string) || 0,
      caloriesBurned: parseInt(rawData.caloriesBurned as string) || 0,
      exerciseEquipments: equipments, // On envoie la liste mise à jour
    };

    try {
      const res = await fetch(`http://localhost:8080/api/exercises/${item.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Exercise updated successfully");
        setIsOpen(false);
        if (onExerciseUpdated) onExerciseUpdated();
      } else {
        const errorMsg = await res.text();
        toast.error("Update failed: " + errorMsg);
      }
    } catch (error) {
      toast.error("An error occurred during update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground p-0 h-auto font-bold tracking-tight">
          {item.name}
        </Button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerContent className={isMobile ? "" : "h-screen top-0 right-0 left-auto mt-0 w-[450px] rounded-none"}>
          <DrawerHeader>
            <DrawerTitle>Edit Exercise</DrawerTitle>
            <DrawerDescription>Update the technical details for {item.name}.</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm flex-1">
            <form id="edit-exercise-form" onSubmit={handleUpdate} className="flex flex-col gap-6 py-4">

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Identity</h4>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" defaultValue={item.name} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="exerciseType">Type</Label>
                  <Select name="exerciseType" defaultValue={item.exerciseType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {EXERCISE_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" defaultValue={item.description} className="min-h-[80px]" required />
                </div>
              </div>

              <Separator />

              {/* SECTION EQUIPMENTS AJOUTÉE */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Equipment</h4>
                  <IconBarbell size={16} className="text-muted-foreground" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {equipments.filter(e => e !== "None").map((eq) => (
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
                  {equipments.every(e => e === "None") && (
                    <span className="text-zinc-500 italic text-xs">Bodyweight (No equipment)</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Dumbbells, Kettlebell..."
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

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="intensityLevel">Intensity</Label>
                    <Select name="intensityLevel" defaultValue={item.intensityLevel}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {INTENSITY_LEVELS.map(l => (
                          <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="durationInSeconds">Duration (sec)</Label>
                    <Input id="durationInSeconds" name="durationInSeconds" type="number" defaultValue={item.durationInSeconds} required />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sets">Sets</Label>
                    <Input id="sets" name="sets" type="number" defaultValue={item.sets} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repetitions">Reps</Label>
                    <Input id="repetitions" name="repetitions" type="number" defaultValue={item.repetitions} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="caloriesBurned">Kcal</Label>
                    <Input id="caloriesBurned" name="caloriesBurned" type="number" defaultValue={item.caloriesBurned} required />
                  </div>
                </div>
              </div>
            </form>
          </div>

          <DrawerFooter className="border-t">
            <Button type="submit" form="edit-exercise-form" disabled={loading}>
              {loading ? "Saving..." : "Update Exercise"}
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
