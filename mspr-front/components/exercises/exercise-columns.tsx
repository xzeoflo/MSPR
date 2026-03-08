"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Exercise } from "@/types/exercise";
import { Button } from "@/components/ui/button";
import { IconDotsVertical, IconBarbell, IconClock, IconFlame } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { DragHandle } from "../drag-handle";

const getIntensityColor = (level: string) => {
  switch (level) {
    case "BEGINNER": return "bg-green-100 text-green-700 border-green-200";
    case "INTERMEDIATE": return "bg-blue-100 text-blue-700 border-blue-200";
    case "ADVANCED": return "bg-orange-100 text-orange-700 border-orange-200";
    case "NIGHTMARE": return "bg-red-100 text-red-700 border-red-200 animate-pulse";
    default: return "bg-slate-100 text-slate-700";
  }
};

export const columns: ColumnDef<Exercise>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => {
      const id = row.original.id;
      if (id === undefined) return null;
      return <DragHandle id={id} />;
    },
  },
  {
    accessorKey: "name",
    header: "Exercise",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-sm flex items-center gap-2">
          <IconBarbell size={14} className="text-primary" />
          {row.getValue("name")}
        </span>
        <span className="text-[11px] text-muted-foreground line-clamp-1 italic">
          {row.original.exerciseType}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "intensityLevel",
    header: "Intensity",
    cell: ({ row }) => {
      const level = row.getValue("intensityLevel") as string;
      return (
        <Badge variant="outline" className={`text-[10px] font-bold ${getIntensityColor(level)}`}>
          {level}
        </Badge>
      );
    },
  },
  {
    id: "volume",
    header: "Sets & Reps",
    cell: ({ row }) => (
      <div className="text-xs font-medium">
        <span className="text-primary">{row.original.sets}</span>
        <span className="text-muted-foreground mx-1">×</span>
        <span>{row.original.repetitions}</span>
      </div>
    ),
  },
  {
    accessorKey: "durationInSeconds",
    header: "Duration",
    cell: ({ row }) => {
      const seconds = row.original.durationInSeconds;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <IconClock size={12} />
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
        {row.getValue("caloriesBurned")} kcal
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <IconDotsVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => console.log("Edit", row.original.id)}>
            Edit details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 font-medium"
            onClick={() => console.log("Delete Exercise", row.original.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
