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

    const parseNum = (val: any) => {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    const payload = {
      id: item.id,
      name: rawData.name as string,
      mealType: rawData.mealType as string,
      allergies: rawData.allergies as string,
      quantityG: parseNum(rawData.quantityG),
      caloriesKcal: parseNum(rawData.caloriesKcal),
      proteinG: parseNum(rawData.proteinG),
      carbsG: parseNum(rawData.carbsG),
      fatsG: parseNum(rawData.fatsG),
      fiberG: parseNum(rawData.fiberG),
      sugarG: parseNum(rawData.sugarG),
      sodiumMg: parseNum(rawData.sodiumMg),
      cholesterolMg: parseNum(rawData.cholesterolMg),
      partnerBrand: rawData.partnerBrand === "" ? null : (rawData.partnerBrand as string),
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
        toast.error(`Update failed: ${errorMsg}`);
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
        <Button
          variant="link"
          className="text-foreground p-0 h-auto font-bold tracking-tight text-left break-words max-w-[250px] justify-start  transition-colors"
        >
          {item.name || "Unnamed Meal"}
        </Button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerContent className={isMobile ? "" : "h-screen top-0 right-0 left-auto mt-0 w-[450px] rounded-none shadow-xl"}>
          <DrawerHeader className="border-b pb-4">
            <DrawerTitle className="text-xl">Edit Meal Details</DrawerTitle>
            <DrawerDescription>
              Update nutrition facts for <span className="font-semibold text-foreground">{item.name}</span>.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-6 text-sm flex-1">
            <form id="edit-meal-form" onSubmit={handleUpdate} className="flex flex-col gap-6 py-6">

              {/* SECTION: GENERAL */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">General Information</h4>
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-xs font-semibold">Dish Name</Label>
                  <Input id="name" name="name" defaultValue={item.name} required className="bg-muted/30" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="mealType" className="text-xs font-semibold">Category (e.g., Breakfast, Lunch)</Label>
                  <Input id="mealType" name="mealType" defaultValue={item.mealType} className="bg-muted/30" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantityG" className="text-xs font-semibold">Portion (g)</Label>
                    <Input id="quantityG" name="quantityG" type="number" step="0.1" defaultValue={item.quantityG} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="caloriesKcal" className="text-xs font-semibold">Calories (kcal)</Label>
                    <Input id="caloriesKcal" name="caloriesKcal" type="number" step="0.1" defaultValue={item.caloriesKcal} required />
                  </div>
                </div>
              </div>

              <Separator className="opacity-50" />

              {/* SECTION: MACROS */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Macronutrients (per portion)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="proteinG" className="text-blue-600 font-bold">Proteins (g)</Label>
                    <Input id="proteinG" name="proteinG" type="number" step="0.1" defaultValue={item.proteinG} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="carbsG" className="text-emerald-600 font-bold">Carbs (g)</Label>
                    <Input id="carbsG" name="carbsG" type="number" step="0.1" defaultValue={item.carbsG} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fatsG" className="text-amber-600 font-bold">Fats (g)</Label>
                    <Input id="fatsG" name="fatsG" type="number" step="0.1" defaultValue={item.fatsG} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="fiberG" className="text-xs font-semibold text-emerald-700">Fiber (g)</Label>
                    <Input id="fiberG" name="fiberG" type="number" step="0.1" defaultValue={item.fiberG} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sugarG" className="text-xs font-semibold text-pink-700">Sugar (g)</Label>
                    <Input id="sugarG" name="sugarG" type="number" step="0.1" defaultValue={item.sugarG} />
                  </div>
                </div>
              </div>

              <Separator className="opacity-50" />

              {/* SECTION: HEALTH */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Health & Source</h4>
                <div className="grid gap-2">
                  <Label htmlFor="allergies" className="text-xs font-semibold">Allergies</Label>
                  <Input id="allergies" name="allergies" defaultValue={item.allergies ?? ""} placeholder="None" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="partnerBrand" className="text-xs font-semibold">Partner Brand</Label>
                  <Input id="partnerBrand" name="partnerBrand" defaultValue={item.partnerBrand ?? ""} placeholder="Internal" />
                </div>
              </div>
            </form>
          </div>

          <DrawerFooter className="border-t bg-muted/10">
            <Button type="submit" form="edit-meal-form" disabled={loading} className="w-full">
              {loading ? "Saving Changes..." : "Update Meal"}
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
