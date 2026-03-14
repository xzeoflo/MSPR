"use client";

import * as React from "react";
import { User } from "@/types/user";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface UserCellViewerProps {
  item: User;
}

export function UserCellViewer({ item }: UserCellViewerProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updatedData = Object.fromEntries(formData.entries());
    const token = getAuthToken();

    try {
      const response = await fetch(`http://localhost:8080/api/users/${item.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        console.log("User updated successfully");
        setIsOpen(false);
        window.location.reload();
      } else {
        console.error("Failed to update user:", response.status);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          type="button"
          className="text-foreground w-fit px-0 text-left font-medium"
        >
          {item.firstName} {item.lastName || ""}
        </Button>
      </DrawerTrigger>

      <DrawerPortal>
        <DrawerContent
          className={isMobile ? "" : "h-screen top-0 right-0 left-auto mt-0 w-[450px] rounded-none"}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DrawerHeader className="gap-1">
            <DrawerTitle>User Profile</DrawerTitle>
            <DrawerDescription>
              Update detailed information for {item.firstName}.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
            {!isMobile && <Separator className="my-2" />}

            <form id="edit-user-form" onSubmit={handleSave} className="flex flex-col gap-6 py-4">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary italic">Identity</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="firstName" className="text-xs font-semibold uppercase text-muted-foreground">First Name</Label>
                    <Input id="firstName" name="firstName" defaultValue={item.firstName} required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lastName" className="text-xs font-semibold uppercase text-muted-foreground">Last Name</Label>
                    <Input id="lastName" name="lastName" defaultValue={item.lastName || ""} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase text-muted-foreground">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={item.email} required />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary italic">Professional</h4>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="partnerBrand" className="text-xs font-semibold uppercase text-muted-foreground">Partner Brand</Label>
                  <Input
                    id="partnerBrand"
                    name="partnerBrand"
                    defaultValue={item.partnerBrand || ""}
                    placeholder="E.g.: Nike, Amazon, etc."
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="role" className="text-xs font-semibold uppercase text-muted-foreground">Role</Label>
                    <Select name="role" defaultValue={item.role}>
                      <SelectTrigger id="role"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Administrator</SelectItem>
                        <SelectItem value="COACH">Coach</SelectItem>
                        <SelectItem value="CLIENT">Client</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="subscriptionTier" className="text-xs font-semibold uppercase text-muted-foreground">Subscription</Label>
                    <Select name="subscriptionTier" defaultValue={item.subscriptionTier || "FREEMIUM"}>
                      <SelectTrigger id="subscriptionTier"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FREEMIUM">Freemium</SelectItem>
                        <SelectItem value="PREMIUM">Premium</SelectItem>
                        <SelectItem value="PREMIUM_PLUS">Premium Plus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <DrawerFooter className="pt-4 border-t">
            <Button type="submit" form="edit-user-form">Save Changes</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
