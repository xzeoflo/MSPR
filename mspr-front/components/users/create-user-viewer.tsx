"use client";

import * as React from "react";
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
  DrawerPortal
} from "@/components/ui/drawer";

interface CreateUserViewerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onUserCreated?: () => void;
}

export function CreateUserViewer({ open, setOpen, onUserCreated }: CreateUserViewerProps) {
  const isMobile = useIsMobile();

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const token = getAuthToken();

    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setOpen(false);
        if (onUserCreated) onUserCreated();
      } else {
        alert("Failed to create user: " + response.status);
      }
    } catch (error) {
      alert("Error creating user: " + error);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
      <DrawerPortal>
        <DrawerContent
          className={isMobile ? "" : "h-screen top-0 right-0 left-auto mt-0 w-[450px] rounded-none"}
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <DrawerHeader className="gap-1">
            <DrawerTitle>Create User</DrawerTitle>
            <DrawerDescription>
              Fill in the details to create a new user.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
            {!isMobile && <Separator className="my-2" />}

            <form id="create-user-form" onSubmit={handleCreate} className="flex flex-col gap-6 py-4">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary italic">Identity</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="firstname" className="text-xs font-semibold uppercase text-muted-foreground">First Name</Label>
                    <Input id="firstname" name="firstname" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lastname" className="text-xs font-semibold uppercase text-muted-foreground">Last Name</Label>
                    <Input id="lastname" name="lastname" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase text-muted-foreground">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary italic">Professional</h4>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="partnerBrand" className="text-xs font-semibold uppercase text-muted-foreground">Partner Brand</Label>
                  <Input id="partnerBrand" name="partnerBrand" placeholder="E.g.: Nike, Amazon, etc." />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="role" className="text-xs font-semibold uppercase text-muted-foreground">Role</Label>
                    <Select name="role" defaultValue="CLIENT" required>
                      <SelectTrigger id="role"><SelectValue placeholder="Select role" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Administrator</SelectItem>
                        <SelectItem value="COACH">Coach</SelectItem>
                        <SelectItem value="CLIENT">Client</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="subscriptionTier" className="text-xs font-semibold uppercase text-muted-foreground">Subscription</Label>
                    <Select name="subscriptionTier" defaultValue="FREEMIUM">
                      <SelectTrigger id="subscriptionTier"><SelectValue placeholder="Select subscription" /></SelectTrigger>
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
            <Button type="submit" form="create-user-form">Create User</Button>
            <DrawerClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
