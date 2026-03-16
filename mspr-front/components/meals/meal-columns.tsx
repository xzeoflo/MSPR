"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Meal } from "@/types/meal";
import { Button } from "@/components/ui/button";
import {
  IconDotsVertical,
  IconFlame,
  IconLoader2,
  IconScale,
  IconAlertTriangle,
  IconLeaf,
  IconCandy
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { getAuthToken } from "@/lib/auth";
import { toast } from "sonner";
import { MealCellViewer } from "./meal-cell-viewer";

const ActionCell = ({ meal, onRefresh }: { meal: Meal; onRefresh: () => void }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    setIsDeleting(true);
    const token = getAuthToken();
    try {
      const response = await fetch(`http://localhost:8080/api/meals/${meal.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success(`Meal deleted successfully`);
        onRefresh();
      } else {
        const errorText = await response.text();
        toast.error(`Failed to delete: ${errorText || response.statusText}`);
      }
    } catch (err) {
      toast.error("Network error while deleting");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" disabled={isDeleting}>
          {isDeleting ? <IconLoader2 className="animate-spin size-4" /> : <IconDotsVertical className="size-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="text-red-600 focus:text-red-600 font-medium" onClick={handleDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getColumns = (fetchMeals: () => void): ColumnDef<Meal>[] => [
  {
    id: "_blank",
    header: "",
    cell: () => <div className="w-2" />,
  },
  {
    accessorKey: "name",
    header: "Dish & Type",
    cell: ({ row }) => {
      const { name, mealType } = row.original;
      return (
        <div className="flex flex-col min-w-[200px] py-1">

          <MealCellViewer
            item={row.original}
            onMealUpdated={fetchMeals}
          />

          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 px-1">
            {mealType || "Uncategorized"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "caloriesKcal",
    header: "Energy",
    cell: ({ row }) => (
      <div className="flex items-center text-orange-500 gap-1.5 text-sm font-medium">
        <IconFlame size={14} />
        {row.original.caloriesKcal} <span className="text-s ml-0.5 uppercase opacity-70">kcal</span>
      </div>
    ),
  },
  {
    id: "macros",
    header: "Macros (P/C/F)",
    cell: ({ row }) => {
      const { proteinG, carbsG, fatsG } = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-m  text-muted-foreground font-bold uppercase">Prot</span>
            <span className="text-s font-bold text-blue-600">{proteinG}g</span>
          </div>
          <div className="flex flex-col border-l border-border/50 pl-3">
            <span className="text-m  text-muted-foreground font-bold uppercase">Carbs</span>
            <span className="text-s font-bold text-emerald-600">{carbsG}g</span>
          </div>
          <div className="flex flex-col border-l border-border/50 pl-3">
            <span className="text-m  text-muted-foreground font-bold uppercase">Fats</span>
            <span className="text-s font-bold text-amber-600">{fatsG}g</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "extra-nutrients",
    header: "Fiber & Sugar",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-m  font-medium text-emerald-600">
          <IconLeaf size={12} />
          <span>{row.original.fiberG}g <span className="text-m  ml-0.5 uppercase opacity-80">fiber</span></span>
        </div>
        <div className="flex items-center gap-1.5 text-m font-medium text-pink-600">
          <IconCandy size={12} />
          <span>{row.original.sugarG}g <span className="text-m  ml-0.5 uppercase opacity-80">sugar</span></span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "allergies",
    header: "Allergies",
    cell: ({ row }) => {
      const allergies = row.original.allergies;
      if (!allergies || ["None", "none", "", "Aucune"].includes(allergies))
        return <span className="ml-0.5 text-muted-foreground text-m  italic opacity-50">None</span>;
      return (
        <div className="flex items-center gap-1 text-m  font-bold text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-full border border-red-100 dark:border-red-900/50 w-fit">
          <IconAlertTriangle size={12} />
          {allergies}
        </div>
      );
    },
  },
  {
    accessorKey: "partnerBrand",
    header: "Source",
    cell: ({ row }) => (
      <div className="text-xs font-bold text-muted-foreground/70 uppercase tracking-tight">
        {row.original.partnerBrand || "Generic"}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <ActionCell meal={row.original} onRefresh={fetchMeals} />
    ),
  },
];
