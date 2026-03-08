"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Workout } from "@/types/workout";
import { Button } from "@/components/ui/button";
import {
  IconClock,
  IconDotsVertical,
  IconFlame,
  IconLoader2,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { WorkoutCellViewer } from "./workout-cell-viewer";
import { useState } from "react";
import { getAuthToken } from "@/lib/auth";
import { toast } from "sonner";

const ActionCell = ({ workout, onRefresh }: { workout: Workout; onRefresh: () => void }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${workout.title}"?`)) return;

    setIsDeleting(true);
    const token = getAuthToken();

    try {
      const response = await fetch(`http://localhost:8080/api/workouts/${workout.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success(`Workout "${workout.title}" deleted`);
        onRefresh();
      } else {
        toast.error("Failed to delete workout");
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

export const getColumns = (fetchWorkouts: () => void): ColumnDef<Workout>[] => [
  {
    accessorKey: "title",
    header: "Workout",
    cell: ({ row }) => (
      <WorkoutCellViewer
        item={row.original}
        onWorkoutUpdated={fetchWorkouts}
      />
    ),
  },
  {
    accessorKey: "difficulty",
    header: "Intensity",
    cell: ({ row }) => {
      const difficultyValue = row.original.difficulty ?? "";
      const difficulty = difficultyValue.toUpperCase();

      let variantClasses = "";
      switch (difficulty) {
        case "BEGINNER": variantClasses = "bg-emerald-700 border-emerald-700"; break;
        case "INTERMEDIATE": variantClasses = "bg-yellow-700 border-yellow-700"; break;
        case "ADVANCED": variantClasses = "bg-red-700 border-red-700"; break;
        case "NIGHTMARE": variantClasses = "bg-purple-700 border-purple-700"; break;
        default: variantClasses = "bg-slate-700 border-slate-700";
      }

      return (
        <div className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase border text-white ${variantClasses}`}>
          <IconFlame size={10} />
          {difficultyValue}
        </div>
      );
    },
  },
  {
    accessorKey: "totalDurationInSeconds",
    header: "Duration",
    cell: ({ row }) => {
      const totalSeconds: number = row.original.totalDurationInSeconds ?? 0;
      const formatDuration = (seconds: number) => {
        if (seconds === 0) return "0s";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}h ${m}m`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
      };

      return (
        <div className="flex items-center gap-1.5 text-sm font-medium font-mono">
          <IconClock size={14} className="text-muted-foreground" />
          {formatDuration(totalSeconds)}
        </div>
      );
    },
  },
  {
    accessorKey: "workoutType",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0">
        <span className="text-sm font-medium leading-tight">{row.original.workoutType}</span>
        <span className="text-[10px] text-muted-foreground italic leading-tight">
          {row.original.exerciseType}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "partnerBrand",
    header: "Partner Brand",
    cell: ({ row }) => (
      <div className="text-sm italic text-muted-foreground font-medium">
        {row.original.partnerBrand || "Independent"}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell workout={row.original} onRefresh={fetchWorkouts} />,
  },
];
