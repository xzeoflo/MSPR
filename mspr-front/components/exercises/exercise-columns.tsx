"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Exercise } from "@/types/exercise";
import { Button } from "@/components/ui/button";
import {
  IconDotsVertical,
  IconClock,
  IconFlame,
  IconLoader2
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
import { ExerciseCellViewer } from "./exercise-cell-viewer";

const ActionCell = ({ exercise, onRefresh }: { exercise: Exercise; onRefresh: () => void }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const token = getAuthToken();

    try {
      const response = await fetch(`http://localhost:8080/api/exercises/${exercise.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success(`Exercise "${exercise.name}" deleted`);
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

const getIntensityColor = (level: string) => {
  switch (level?.toUpperCase()) {
    case "BEGINNER": return "bg-emerald-700 border-emerald-700";
    case "INTERMEDIATE": return "bg-yellow-700 border-yellow-700";
    case "ADVANCED": return "bg-red-700 border-red-700";
    default: return "bg-slate-700 border-slate-700";
  }
};

export const getColumns = (fetchExercises: () => void): ColumnDef<Exercise>[] => [
  {
    id: "_blank",
    header: "",
    cell: () => <div className="w-2" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Exercise",
    cell: ({ row }) => (
      <ExerciseCellViewer
        item={row.original}
        onExerciseUpdated={fetchExercises}
      />
    ),
  },
  {
    accessorKey: "exerciseType",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-sm font-bold tracking-tight">
        {row.original.exerciseType}
      </span>
    ),
  },
  {
    accessorKey: "exerciseEquipments",
    header: "Equipment",
    cell: ({ row }) => {
      const equipments = row.original.exerciseEquipments || [];

      const filteredEquips = equipments.filter(e => e.toLowerCase() !== "none");

      if (filteredEquips.length === 0) {
        return <span className="px-1.5 py-0.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 text-[9px] font-bold uppercase tracking-wider">Bodyweight</span>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {filteredEquips.map((eq, index) => (
            <div
              key={index}
              className="px-1.5 py-0.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 text-[9px] font-bold uppercase tracking-wider"
            >
              {eq}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "intensityLevel",
    header: "Intensity",
    cell: ({ row }) => {
      const level = (row.getValue("intensityLevel") as string) || "UNKNOWN";
      return (
        <div className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase border text-white shadow-sm ${getIntensityColor(level)}`}>
          <IconFlame size={10} />
          {level}
        </div>
      );
    },
  },
  {
    id: "volume",
    header: "Sets & Reps",
    cell: ({ row }) => (
      <div className="text-xs font-medium">
        <span className="text-primary font-bold">{row.original.sets}</span>
        <span className="text-muted-foreground mx-1 text-[10px]">SET ×</span>
        <span className="font-bold">{row.original.repetitions}</span>
        <span className="text-muted-foreground ml-1 text-[10px]">REPS</span>
      </div>
    ),
  },
  {
    accessorKey: "durationInSeconds",
    header: "Duration",
    cell: ({ row }) => {
      const seconds = row.original.durationInSeconds || 0;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return (
        <div className="flex items-center gap-1.5 text-sm font-medium font-mono text-muted-foreground">
          <IconClock size={14} />
          {mins > 0 ? `${mins}m ${secs}s` : `${secs}s`}
        </div>
      );
    },
  },
  {
    accessorKey: "caloriesBurned",
    header: "Calories",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-xs font-semibold text-orange-600">
        <IconFlame size={12} />
        {row.getValue("caloriesBurned")} <span className="text-[10px] ml-0.5">KCAL</span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <ActionCell exercise={row.original} onRefresh={fetchExercises} />
    ),
  },
];
