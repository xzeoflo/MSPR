"use client";

import * as React from "react";
import { Workout } from "@/types/workout";
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
  DrawerTrigger,
  DrawerPortal
} from "@/components/ui/drawer";

interface WorkoutCellViewerProps {
  item: Workout;
}

export function WorkoutCellViewer({ item }: WorkoutCellViewerProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          type="button"
          className="text-foreground w-fit px-0 text-left font-medium"
        >
          {item.title}
        </Button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerContent
          className={isMobile ? "" : "h-screen top-0 right-0 left-auto mt-0 w-[450px] rounded-none"}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DrawerHeader className="gap-1">
            <DrawerTitle>Workout Details</DrawerTitle>
            <DrawerDescription>
              Modify session parameters for {item.title}.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
            {!isMobile && <Separator className="my-2" />}

            <form id="edit-workout-form" className="flex flex-col gap-6 py-4">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary italic">General Info</h4>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="title" className="text-xs font-semibold uppercase text-muted-foreground">Title</Label>
                  <Input id="title" name="title" defaultValue={item.title} required />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="description" className="text-xs font-semibold uppercase text-muted-foreground">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={item.description}
                    className="min-h-[100px] resize-none"
                    required
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary italic">Configuration</h4>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="duration" className="text-xs font-semibold uppercase text-muted-foreground">Duration (min)</Label>
                    <Input id="duration" name="duration" type="number" defaultValue={item.totalDurationInSeconds} required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="difficulty" className="text-xs font-semibold uppercase text-muted-foreground">Intensity</Label>
                    <Select name="difficulty" defaultValue={item.difficulty}>
                      <SelectTrigger id="difficulty"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="type" className="text-xs font-semibold uppercase text-muted-foreground">Workout Type</Label>
                    <Input id="type" name="type" defaultValue={item.workoutType} placeholder="e.g. HIIT, Yoga" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="exerciseType" className="text-xs font-semibold uppercase text-muted-foreground">Exercise Type</Label>
                    <Input id="exerciseType" name="exerciseType" defaultValue={item.exerciseType} placeholder="e.g. Cardio, Strength" required />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary italic">Organization</h4>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="partnerBrand" className="text-xs font-semibold uppercase text-muted-foreground">Partner Brand</Label>
                  <Input
                    id="partnerBrand"
                    name="partnerBrand"
                    defaultValue={item.partnerBrand || ""}
                    placeholder="Independent"
                  />
                </div>
              </div>
            </form>
          </div>

          <DrawerFooter className="pt-4 border-t">
            <Button type="submit" form="edit-workout-form">Update Workout</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
