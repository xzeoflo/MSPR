"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getAuthToken } from "@/lib/auth";
import { toast } from "sonner";
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

interface CreateMealViewerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onMealCreated?: () => void;
}

export function CreateMealViewer({ open, setOpen, onMealCreated }: CreateMealViewerProps) {
  const isMobile = useIsMobile();
  const [loading, setLoading] = React.useState(false);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const rawData = Object.fromEntries(formData.entries());
    const token = getAuthToken();

    const payload = {
      mealType: rawData.mealType,
      allergies: rawData.allergies || "None",
      quantityG: parseFloat(rawData.quantityG as string) || 0,
      caloriesKcal: parseFloat(rawData.caloriesKcal as string) || 0,
      proteinG: parseFloat(rawData.proteinG as string) || 0,
      carbsG: parseFloat(rawData.carbsG as string) || 0,
      fatsG: parseFloat(rawData.fatsG as string) || 0,
      fiberG: parseFloat(rawData.fiberG as string) || 0,
      sugarG: parseFloat(rawData.sugarG as string) || 0,
      sodiumMg: parseFloat(rawData.sodiumMg as string) || 0,
      cholesterolMg: parseFloat(rawData.cholesterolMg as string) || 0,
      partnerBrand: rawData.partnerBrand || null,
    };

    try {
      const response = await fetch("http://localhost:8080/api/meals", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Meal created successfully");
        setOpen(false);
        if (onMealCreated) onMealCreated();
      } else {
        const errorData = await response.text();
        toast.error("Failed to create meal: " + errorData);
      }
    } catch (error) {
      toast.error("Network error while creating meal");
    } finally {
      setLoading(false);
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
            <DrawerTitle>Create New Meal</DrawerTitle>
            <DrawerDescription>
              Add a new meal to the database with its nutritional values.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm flex-1">
            {!isMobile && <Separator className="my-2" />}

            <form id="create-meal-form" onSubmit={handleCreate} className="flex flex-col gap-6 py-4">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary italic">General Info</h4>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="mealType" className="text-xs font-semibold uppercase text-muted-foreground">Meal Name</Label>
                  <Input id="mealType" name="mealType" placeholder="e.g. Chicken Salad" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="quantityG" className="text-xs font-semibold uppercase text-muted-foreground">Portion (g)</Label>
                    <Input id="quantityG" name="quantityG" type="number" defaultValue="100" step="0.1" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="caloriesKcal" className="text-xs font-semibold uppercase text-muted-foreground">Calories (kcal)</Label>
                    <Input id="caloriesKcal" name="caloriesKcal" type="number" defaultValue="0" step="0.1" required />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary italic">Macronutrients (g)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="proteinG" className="text-xs font-semibold uppercase text-blue-600">Protein</Label>
                    <Input id="proteinG" name="proteinG" type="number" defaultValue="0" step="0.1" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="carbsG" className="text-xs font-semibold uppercase text-emerald-600">Carbs</Label>
                    <Input id="carbsG" name="carbsG" type="number" defaultValue="0" step="0.1" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="fatsG" className="text-xs font-semibold uppercase text-amber-600">Fats</Label>
                    <Input id="fatsG" name="fatsG" type="number" defaultValue="0" step="0.1" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="fiberG" className="text-xs font-semibold uppercase text-muted-foreground">Fiber</Label>
                    <Input id="fiberG" name="fiberG" type="number" defaultValue="0" step="0.1" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="sugarG" className="text-xs font-semibold uppercase text-muted-foreground">Sugar</Label>
                    <Input id="sugarG" name="sugarG" type="number" defaultValue="0" step="0.1" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary italic">Health & Brand</h4>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="allergies" className="text-xs font-semibold uppercase text-muted-foreground">Allergies</Label>
                  <Input id="allergies" name="allergies" placeholder="e.g. Gluten, Nuts" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="partnerBrand" className="text-xs font-semibold uppercase text-muted-foreground">Partner Brand</Label>
                  <Input id="partnerBrand" name="partnerBrand" placeholder="Internal or brand name" />
                </div>
              </div>
            </form>
          </div>

          <DrawerFooter className="pt-4 border-t">
            <Button type="submit" form="create-meal-form" disabled={loading}>
              {loading ? "Saving..." : "Save Meal"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
