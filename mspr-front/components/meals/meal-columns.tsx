"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Meal } from "@/types/meal";
import { Button } from "@/components/ui/button";
import {
  IconDotsVertical,
  IconToolsKitchen2,
  IconFlame,
  IconLoader2,
  IconScale,
  IconAlertTriangle
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
        headers: {
          "Authorization": `Bearer ${token}`,
        },
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
          {isDeleting ? (
            <IconLoader2 className="animate-spin size-4" />
          ) : (
            <IconDotsVertical className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 font-medium"
          onClick={handleDelete}
        >
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "mealType",
    header: "Meal",
    cell: ({ row }) => (
      <MealCellViewer
        item={row.original}
        onMealUpdated={fetchMeals}
      />
    ),
  },
  {
    accessorKey: "quantityG",
    header: "Portion",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <IconScale size={14} />
        {row.original.quantityG}g
      </div>
    ),
  },
  {
    accessorKey: "caloriesKcal",
    header: "Energy",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-xs font-bold text-orange-600">
        <IconFlame size={14} />
        {row.original.caloriesKcal} <span className="text-[10px] ml-0.5 uppercase">kcal</span>
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
            <span className="text-[10px] text-muted-foreground font-bold uppercase">Prot</span>
            <span className="text-xs font-bold text-blue-600">{proteinG}g</span>
          </div>
          <div className="flex flex-col border-l pl-3">
            <span className="text-[10px] text-muted-foreground font-bold uppercase">Carbs</span>
            <span className="text-xs font-bold text-emerald-600">{carbsG}g</span>
          </div>
          <div className="flex flex-col border-l pl-3">
            <span className="text-[10px] text-muted-foreground font-bold uppercase">Fats</span>
            <span className="text-xs font-bold text-amber-600">{fatsG}g</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "allergies",
    header: "Allergies",
    cell: ({ row }) => {
      const allergies = row.original.allergies;
      if (!allergies || allergies === "None") return <span className="text-muted-foreground text-xs italic">None</span>;
      return (
        <div className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-full w-fit border border-red-100 dark:border-red-900/50">
          <IconAlertTriangle size={12} />
          {allergies}
        </div>
      );
    },
  },
  {
    accessorKey: "partnerBrand",
    header: "Brand",
    cell: ({ row }) => (
      <div className="text-xs font-semibold text-muted-foreground italic">
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
