"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Workout } from "@/types/workout";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  IconDotsVertical,
  IconClock,
  IconFlame,
  IconGripVertical
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { WorkoutCellViewer } from "./workout-cell-viewer";

export const columns: ColumnDef<Workout>[] = [
  {
    id: "drag",
    header: () => null,
    cell: () => (
      <div className="px-1">
        <IconGripVertical size={16} className="text-muted-foreground/30 cursor-grab active:cursor-grabbing" />
      </div>
    ),
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Workout",
    cell: ({ row }) => <WorkoutCellViewer item={row.original} />,
  },
  {
    accessorKey: "difficulty",
    header: "Intensity",
    cell: ({ row }) => {
      const difficulty = row.original.difficulty;

      const variants: Record<string, string> = {
        BEGINNER: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        INTERMEDIATE: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        ADVANCED: "bg-red-500/10 text-red-600 border-red-500/20",
      };

      return (
        <div className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold border ${variants[difficulty]}`}>
          <IconFlame size={10} />
          {difficulty}
        </div>
      );
    },
  },
  {
    accessorKey: "totalDurationInSeconds",
    header: "Duration",
    cell: ({ row }) => {
      const totalSeconds = row.original.totalDurationInSeconds || 0;
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
    accessorKey: "type",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <Badge variant="outline" className="w-fit text-[10px] font-semibold uppercase px-1.5 py-0">
          {row.original.workoutType}
        </Badge>
        <span className="text-[10px] text-muted-foreground ml-1 italic">
          {row.original.exerciseType}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "partnerBrand",
    header: "Partner",
    cell: ({ row }) => (
      <div className="text-[11px] italic text-muted-foreground">
        {row.original.partnerBrand || "Independent"}
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
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <WorkoutCellViewer item={row.original} />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("Stats", row.original.id)}>
            Statistics
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => console.log("Delete", row.original.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
