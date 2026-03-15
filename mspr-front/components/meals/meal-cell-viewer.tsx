"use client";

import * as React from "react";
import { Meal } from "@/types/meal";
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
  DrawerTrigger,
  DrawerPortal
} from "@/components/ui/drawer";

interface MealCellViewerProps {
  item: Meal;
  onMealUpdated?: () => void;
}

export function MealCellViewer({ item, onMealUpdated }: MealCellViewerProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const rawData = Object.fromEntries(formData.entries());
    const token = getAuthToken();

    const payload = {
      id: item.id,
      mealType: rawData.mealType,
      allergies: rawData.allergies,
      quantityG: parseFloat(rawData.quantityG as string) || 0,
      caloriesKcal: parseFloat(rawData.caloriesKcal as string) || 0,
      proteinG: parseFloat(rawData.proteinG as string) || 0,
      carbsG: parseFloat(rawData.carbsG as string) || 0,
      fatsG: parseFloat(rawData.fatsG as string) || 0,
      fiberG: parseFloat(rawData.fiberG as string) || 0,
      sugarG: parseFloat(rawData.sugarG as string) || 0,
      sodiumMg: parseFloat(rawData.sodiumMg as string) || 0,
      cholesterolMg: parseFloat(rawData.cholesterolMg as string) || 0,
      partnerBrand: item.partnerBrand,
    };

    try {
      const res = await fetch(`http://localhost:8080/api/meals/${item.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Meal updated successfully");
        setIsOpen(false);
        if (onMealUpdated) onMealUpdated();
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
        <Button variant="link" className="text-foreground p-0 h-auto font-bold tracking-tight text-left">
          {item.mealType}
        </Button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerContent className={isMobile ? "" : "h-screen top-0 right-0 left-auto mt-0 w-[450px] rounded-none"}>
          <DrawerHeader>
            <DrawerTitle>Edit Meal</DrawerTitle>
            <DrawerDescription>Nutrition facts for {item.mealType}.</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm flex-1">
            <form id="edit-meal-form" onSubmit={handleUpdate} className="flex flex-col gap-6 py-4">

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest">General Info</h4>
                <div className="grid gap-2">
                  <Label htmlFor="mealType">Meal Name / Type</Label>
                  <Input id="mealType" name="mealType" defaultValue={item.mealType} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantityG">Portion (g)</Label>
                    <Input id="quantityG" name="quantityG" type="number" step="0.1" defaultValue={item.quantityG} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="caloriesKcal">Calories (kcal)</Label>
                    <Input id="caloriesKcal" name="caloriesKcal" type="number" step="0.1" defaultValue={item.caloriesKcal} required />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Macronutrients (g)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="proteinG" className="text-blue-600">Proteins</Label>
                    <Input id="proteinG" name="proteinG" type="number" step="0.1" defaultValue={item.proteinG} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="carbsG" className="text-emerald-600">Carbs</Label>
                    <Input id="carbsG" name="carbsG" type="number" step="0.1" defaultValue={item.carbsG} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fatsG" className="text-amber-600">Fats</Label>
                    <Input id="fatsG" name="fatsG" type="number" step="0.1" defaultValue={item.fatsG} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="fiberG">Fiber</Label>
                    <Input id="fiberG" name="fiberG" type="number" step="0.1" defaultValue={item.fiberG} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sugarG">Sugar</Label>
                    <Input id="sugarG" name="sugarG" type="number" step="0.1" defaultValue={item.sugarG} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Health & Brand</h4>
                <div className="grid gap-2">
                  <Label htmlFor="allergies">Allergies (e.g. Nuts, Gluten)</Label>
                  <Input id="allergies" name="allergies" defaultValue={item.allergies ?? ""} placeholder="None" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="partnerBrand">Partner Brand</Label>
                  <Input id="partnerBrand" name="partnerBrand" defaultValue={item.partnerBrand ?? ""} placeholder="Internal" />
                </div>
              </div>
            </form>
          </div>

          <DrawerFooter className="border-t">
            <Button type="submit" form="edit-meal-form" disabled={loading}>
              {loading ? "Saving..." : "Update Meal"}
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
