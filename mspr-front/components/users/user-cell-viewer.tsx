"use client";

import * as React from "react";
import { User } from "@/types/user";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  DrawerTrigger
} from "@/components/ui/drawer";

interface UserCellViewerProps {
  item: User;
}

export function UserCellViewer({ item }: UserCellViewerProps) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left font-medium">
          {item.firstname} {item.lastname || ""}
        </Button>
      </DrawerTrigger>
      <DrawerContent className={isMobile ? "" : "h-screen top-0 right-0 left-auto mt-0 w-[450px] rounded-none"}>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Profil Utilisateur</DrawerTitle>
          <DrawerDescription>
            Modifier les informations détaillées de {item.firstname}.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && <Separator className="my-2" />}

          <form className="flex flex-col gap-6 py-4">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-primary italic">Identité</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstname" className="text-xs font-semibold uppercase text-muted-foreground">Prénom</Label>
                  <Input id="firstname" name="firstname" defaultValue={item.firstname} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lastname" className="text-xs font-semibold uppercase text-muted-foreground">Nom</Label>
                  <Input id="lastname" name="lastname" defaultValue={item.lastname || ""} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-2 sm:col-span-1">
                  <Label htmlFor="age" className="text-xs font-semibold uppercase text-muted-foreground">Âge</Label>
                  <Input id="age" name="age" type="number" defaultValue={item.age || ""} placeholder="Ex: 25" />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="email" className="text-xs font-semibold uppercase text-muted-foreground">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={item.email} />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-primary italic">Professionnel</h4>

              <div className="flex flex-col gap-2">
                <Label htmlFor="partnerBrand" className="text-xs font-semibold uppercase text-muted-foreground">Entreprise Partenaire</Label>
                <Input
                  id="partnerBrand"
                  name="partnerBrand"
                  defaultValue={item.partnerBrand || ""}
                  placeholder="Ex: Nike, Amazon, etc."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="role" className="text-xs font-semibold uppercase text-muted-foreground">Rôle</Label>
                  <Select name="role" defaultValue={item.role}>
                    <SelectTrigger id="role"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                      <SelectItem value="COACH">Coach</SelectItem>
                      <SelectItem value="CLIENT">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="subscriptionTier" className="text-xs font-semibold uppercase text-muted-foreground">Abonnement</Label>
                  <Select name="subscriptionTier" defaultValue={item.subscriptionTier || "FREEMIUM"}>
                    <SelectTrigger id="subscriptionTier"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREEMIUM">Freemium</SelectItem>
                      <SelectItem value="PREMIUM">Premium</SelectItem>
                      <SelectItem value="PRO">Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </form>
        </div>

        <DrawerFooter className="pt-4 border-t">
          <Button onClick={() => console.log("Sauvegarde", item.id)}>Enregistrer les modifications</Button>
          <DrawerClose asChild>
            <Button variant="outline">Annuler</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
